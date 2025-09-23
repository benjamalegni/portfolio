import type { Project } from "@/types/project_type"
import { projectImageOverrides } from "@/data/project-overrides"

const GITHUB_API_BASE = "https://api.github.com"

function mapRepoToProject(repo: any): Project {
  const topics: string[] = Array.isArray(repo.topics) ? repo.topics : []
  const tags = [
    ...topics.map((t: string) => (t.startsWith("#") ? t : `#${t}`)),
  ]
  if (repo.language) {
    const langTag = `#${String(repo.language).toLowerCase()}`
    if (!tags.includes(langTag)) tags.push(langTag)
  }

  const fullName: string = repo.full_name || `${repo.owner?.login || ""}/${repo.name || ""}`
  const overrideImage = projectImageOverrides[fullName] || projectImageOverrides[repo.name]

  return {
    id: String(repo.id),
    name: repo.name ?? "",
    description: repo.description ?? null,
    status: repo.archived ? "archived" : "active",
    category: repo.language ?? "General",
    tags,
    stars: Number(repo.stargazers_count ?? 0),
    forks: Number(repo.forks_count ?? 0),
    language: repo.language ?? null,
    lastUpdate: (repo.pushed_at || repo.updated_at || new Date().toISOString()).slice(0, 10),
    demo: repo.homepage ? String(repo.homepage) : null,
    github: repo.html_url ?? null,
    image: overrideImage || "/placeholder.svg?height=200&width=400",
    features: [],
    isFork: Boolean(repo.fork),
  }
}

export async function fetchUserRepos(username: string, token?: string): Promise<Project[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  const res = await fetch(url, { headers, cache: "no-store" })
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }
  const repos = await res.json()

  // On client (no token), skip per-repo topics calls to avoid rate limits
  if (!token) {
    return repos.map((repo: any) => mapRepoToProject(repo))
  }

  const withTopics = await Promise.all(
    repos.map(async (repo: any) => {
      try {
        const topicsRes = await fetch(`${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/topics`, {
          headers: {
            ...headers,
            Accept: "application/vnd.github.mercy-preview+json",
          },
          cache: "no-store",
        })
        if (topicsRes.ok) {
          const data = await topicsRes.json()
          repo.topics = data.names || []
        }
      } catch {
        // ignore
      }
      return mapRepoToProject(repo)
    })
  )

  return withTopics
}

export type SimplifiedEvent = {
  type: string
  repoName: string
  repoUrl: string
  branch: string | null
  commits: number
  createdAt: string
}

export async function fetchUserEvents(username: string, token?: string): Promise<SimplifiedEvent[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events?per_page=100`
  const res = await fetch(url, { headers, cache: "no-store" })
  if (!res.ok) return []
  const events = await res.json()
  return events.map((e: any) => {
    const type: string = e.type
    const repoName: string = e.repo?.name || ""
    const repoUrl: string = repoName ? `https://github.com/${repoName}` : ""
    let branch: string | null = null
    let commits = 0
    if (type === "PushEvent") {
      branch = e.payload?.ref ? String(e.payload.ref).replace("refs/heads/", "") : null
      commits = Array.isArray(e.payload?.commits) ? e.payload.commits.length : 0
    }
    return {
      type,
      repoName,
      repoUrl,
      branch,
      commits,
      createdAt: e.created_at || new Date().toISOString(),
    }
  })
}

export async function aggregateTopLanguages(
  username: string,
  repos: { name: string; owner?: { login?: string } }[],
  token?: string
): Promise<{ name: string; bytes: number }[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const totals: Record<string, number> = {}

  await Promise.all(
    repos.map(async (repo: any) => {
      const owner = repo.owner?.login || username
      try {
        const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo.name}/languages`, {
          headers,
          cache: "no-store",
        })
        if (!res.ok) return
        const data = await res.json()
        Object.entries<number>(data).forEach(([lang, bytes]) => {
          totals[lang] = (totals[lang] || 0) + bytes
        })
      } catch {
        // ignore
      }
    })
  )

  const out = Object.entries(totals)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
  return out
}

export function formatTimeAgo(isoDate: string): string {
  const d = new Date(isoDate)
  const diffMs = Date.now() - d.getTime()
  const minutes = Math.floor(diffMs / (60 * 1000))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return `${weeks} weeks ago`
} 