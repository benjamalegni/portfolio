import { fetchUserRepos, fetchUserEvents, aggregateTopLanguages, formatTimeAgo } from "@/lib/github"
import type { Project } from "@/types/project_type"

export type GithubSummary = {
  username: string
  totals: { totalRepos: number; totalStars: number }
  recentProjects: Array<{ name: string; description: string | null; tags: string[]; stars: number; language: string | null; lastUpdate: string }>
  weeklyActivity: Array<{ day: string; commits: number }>
  developmentActivity: Array<{ time: string; action: string; repo: string; branch: string | null; url: string }>
  topLanguages: Array<{ name: string; percentage: number }>
  streak: { current: number; longest: number }
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
      // Count actual commits from the event (use exact number from GitHub API)
      commitsForDay += ev.commits
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

  const streak = calculateStreak(events, username)

  return {
    username,
    totals: { totalRepos, totalStars },
    recentProjects,
    weeklyActivity,
    developmentActivity,
    topLanguages,
    streak,
  }
}

function calculateStreak(events: Array<{ type: string; createdAt: string; repoName: string }>, username: string): { current: number; longest: number } {
  const ownRepoPrefix = `${username}/`
  
  // Get unique days with push events to own repos
  const uniqueDays = new Set<string>()
  for (const ev of events) {
    if (ev.type === "PushEvent" && ev.repoName.startsWith(ownRepoPrefix)) {
      const date = new Date(ev.createdAt)
      const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      uniqueDays.add(ymd)
    }
  }
  
  // Convert to sorted array of Date objects
  const sortedDays = Array.from(uniqueDays)
    .map(ymd => new Date(ymd))
    .sort((a, b) => b.getTime() - a.getTime()) // Most recent first
  
  if (sortedDays.length === 0) {
    return { current: 0, longest: 0 }
  }
  
  // Calculate current streak
  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  let checkDate = new Date(today)
  
  // Check if there's activity today or yesterday to start the streak
  const mostRecentDay = sortedDays[0]
  mostRecentDay.setHours(0, 0, 0, 0)
  
  if (mostRecentDay.getTime() === today.getTime() || mostRecentDay.getTime() === yesterday.getTime()) {
    currentStreak = 1
    checkDate = new Date(mostRecentDay)
    checkDate.setDate(checkDate.getDate() - 1)
    
    // Count consecutive days backwards
    for (let i = 1; i < sortedDays.length; i++) {
      const day = sortedDays[i]
      day.setHours(0, 0, 0, 0)
      
      if (day.getTime() === checkDate.getTime()) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }
  
  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 1
  
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const current = new Date(sortedDays[i])
    current.setHours(0, 0, 0, 0)
    const next = new Date(sortedDays[i + 1])
    next.setHours(0, 0, 0, 0)
    
    const diffDays = Math.round((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)
  
  return { current: currentStreak, longest: longestStreak }
} 