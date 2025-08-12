import { aggregateTopLanguages, fetchUserEvents, fetchUserRepos, formatTimeAgo } from "@/lib/github"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usernameParam = searchParams.get("username") || undefined
    const env = (globalThis as any)?.process?.env || {}
    const fallbackUsername = "benjamalegni"
    const username = String(usernameParam || env.GITHUB_USERNAME || env.NEXT_PUBLIC_GITHUB_USERNAME || fallbackUsername)
    const token = env.GITHUB_TOKEN as string | undefined

    // Repos and stars (filter out forks/archived)
    const reposAll = await fetchUserRepos(username, token)
    const repos = reposAll.filter((r) => !r.isFork && r.status !== "archived")
    const totalRepos = repos.length
    const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0)

    // Recent projects (top 3 by lastUpdate)
    const recentProjects = [...repos]
      .sort((a, b) => (b.lastUpdate.localeCompare(a.lastUpdate)))
      .slice(0, 3)
      .map((p) => ({
        name: p.name,
        description: p.description,
        tags: p.tags.slice(0, 3),
        stars: p.stars,
        language: p.language,
        lastUpdate: formatTimeAgo(`${p.lastUpdate}T00:00:00Z`),
      }))

    // Events and weekly commits (own repos only)
    const events = await fetchUserEvents(username, token)
    const ownRepoPrefix = `${username}/`
    const now = new Date()
    const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyCounts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }

    for (const ev of events) {
      const d = new Date(ev.createdAt)
      if (d >= past7 && ev.repoName.startsWith(ownRepoPrefix)) {
        if (ev.type === "PushEvent") {
          const key = days[d.getDay()]
          weeklyCounts[key] += Math.max(1, ev.commits)
        }
      }
    }
    const weeklyActivity = days.map((day) => ({ day, commits: weeklyCounts[day] }))

    // Top languages aggregated via GitHub languages API (use filtered repos)
    let langAgg = await aggregateTopLanguages(username, repos.map((r) => ({ name: r.name })), token)

    // Fallback: derive from primary repo.language distribution if languages API yields no data
    if (!langAgg || langAgg.length === 0) {
      const counts: Record<string, number> = {}
      for (const r of repos) {
        if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
      }
      const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1
      langAgg = Object.entries(counts)
        .map(([name, n]) => ({ name, bytes: (n / total) * 100 }))
        .sort((a, b) => b.bytes - a.bytes)
    }

    const totalBytes = langAgg.reduce((s, l) => s + l.bytes, 0) || 1
    const topLanguages = langAgg
      .slice(0, 5)
      .map((l) => ({ name: l.name, percentage: Math.round((l.bytes / totalBytes) * 100) }))

    return new Response(
      JSON.stringify({
        username,
        totals: { totalRepos, totalStars },
        recentProjects,
        weeklyActivity,
        developmentActivity: events.slice(0, 10).map((ev) => {
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
        }),
        topLanguages,
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
} 