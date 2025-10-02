import type { Project } from "@/types/project_type"

const GITHUB_API_BASE = "https://api.github.com"

function normalizeWorkerBase(): string | null {
  const base = process.env.NEXT_PUBLIC_PORTFOLIO_WORKER_URL
  if (!base) return null
  const trimmed = base.trim()
  if (!trimmed) return null
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed
}

const WORKER_BASE_URL = normalizeWorkerBase()

async function fetchWorkerRepositories(username: string): Promise<Project[] | null> {
  if (!WORKER_BASE_URL) return null

  try {
    const url = new URL(`${WORKER_BASE_URL}/repos`)
    url.searchParams.set("username", username)
    const res = await fetch(url.toString(), { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json().catch(() => null)) as { projects?: Project[] } | null
    const projects = Array.isArray(data?.projects) ? (data!.projects as Project[]) : null
    if (!projects) return null
    return projects.map((project) => ({
      ...project,
      features: Array.isArray(project.features) ? project.features : [],
    }))
  } catch {
    return null
  }
}


export async function fetchUserRepos(username: string, _token?: string): Promise<Project[]> {
  const workerProjects = await fetchWorkerRepositories(username)
  if (workerProjects) return workerProjects
  throw new Error("Worker URL not configured or worker failed")
}

export type SimplifiedEvent = {
  type: string
  repoName: string
  repoUrl: string
  branch: string | null
  commits: number
  createdAt: string
}

export async function fetchUserEvents(username: string): Promise<SimplifiedEvent[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  // Fetch multiple pages to get more events (last 300 events to ensure we cover 7 days)
  const allEvents: any[] = []
  
  for (let page = 1; page <= 3; page++) {
    const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events?per_page=100&page=${page}`
    const res = await fetch(url, { headers, cache: "no-store" })

    if (!res.ok) {
      console.error(`Failed to fetch user events page ${page}`)
      break
    }

    const events = (await res.json()) as any[]
    if (events.length === 0) break
    
    allEvents.push(...events)
    
    // If we have events older than 7 days, we can stop
    const oldestEvent = events[events.length - 1]
    const oldestDate = new Date(oldestEvent.created_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    if (oldestDate < sevenDaysAgo) break
  }

  return allEvents.map((e: any) => {
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

//  function for top languages dashboard
export async function aggregateTopLanguages(
  username: string,
  repos: { name: string; owner?: { login?: string } }[],
): Promise<{ name: string; bytes: number }[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

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
        const data = (await res.json()) as Record<string, number>
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
