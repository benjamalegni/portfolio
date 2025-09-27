import { fetchUserRepos, fetchUserEvents, aggregateTopLanguages, formatTimeAgo } from "@/lib/github"
import type { Project } from "@/types/project_type"

export type GithubSummary = {
  username: string
  totals: { totalRepos: number; totalStars: number }
  recentProjects: Array<{ name: string; description: string | null; tags: string[]; stars: number; language: string | null; lastUpdate: string }>
  weeklyActivity: Array<{ day: string; commits: number }>
  developmentActivity: Array<{ time: string; action: string; repo: string; branch: string | null; url: string }>
  topLanguages: Array<{ name: string; percentage: number }>
}

export async function buildGithubSummary(username: string): Promise<GithubSummary> {
  const reposAll: Project[] = await fetchUserRepos(username)
  const repos: Project[] = reposAll.filter((r) => !r.isFork && r.status !== "archived")
  const totalRepos = repos.length
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0)

  const recentProjects = [...repos]
    .sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate))
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      description: p.description,
      tags: p.tags.slice(0, 3),
      stars: p.stars,
      language: p.language,
      lastUpdate: formatTimeAgo(`${p.lastUpdate}T00:00:00Z`),
    }))

  const events = await fetchUserEvents(username)
  const ownRepoPrefix = `${username}/`

  // Build last 7 calendar days including today
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  function toLocalYmd(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const today = new Date()
  const last7Days: { date: Date; ymd: string; label: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    last7Days.push({ date: d, ymd: toLocalYmd(d), label: weekdayLabels[d.getDay()] })
  }

  const weeklyActivity = last7Days.map(({ ymd, label }) => {
    let commitsForDay = 0
    for (const ev of events) {
      if (ev.type !== "PushEvent") continue
      if (!ev.repoName.startsWith(ownRepoPrefix)) continue
      const evDate = new Date(ev.createdAt)
      if (toLocalYmd(evDate) !== ymd) continue
      commitsForDay += Math.max(1, ev.commits || 0)
    }
    return { day: label, commits: commitsForDay }
  })

  let langAgg = await aggregateTopLanguages(username, repos.map((r) => ({ name: r.name })))
  if (!langAgg || langAgg.length === 0) {
    const counts: Record<string, number> = {}
    for (const r of repos) if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
    const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1
    langAgg = Object.entries(counts).map(([name, n]) => ({ name, bytes: (n / total) * 100 }))
  }
  const totalBytes = langAgg.reduce((s, l) => s + l.bytes, 0) || 1
  const topLanguages = langAgg
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5)
    .map((l) => ({ name: l.name, percentage: Math.round((l.bytes / totalBytes) * 100) }))

  const developmentActivity = events.slice(0, 10).map((ev) => {
    let action = ev.type
    if (ev.type === "PushEvent") action = "pushed commits to"
    else if (ev.type === "PullRequestEvent") action = "opened pull request in"
    else if (ev.type === "CreateEvent") action = "created"
    else if (ev.type === "WatchEvent") action = "starred"
    return {
      time: formatTimeAgo(ev.createdAt),
      action,
      repo: ev.repoName.split("/")[1] || ev.repoName,
      branch: ev.branch,
      url: ev.repoUrl,
    }
  })

  return {
    username,
    totals: { totalRepos, totalStars },
    recentProjects,
    weeklyActivity,
    developmentActivity,
    topLanguages,
  }
} 