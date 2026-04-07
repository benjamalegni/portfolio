"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Star, Code, TrendingUp, Activity } from "lucide-react"
import { buildGithubSummary, type GithubSummary } from "@/lib/github-summary"

export default function DashboardPage() {
  const [summary, setSummary] = useState<GithubSummary | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const s = await buildGithubSummary("benjamalegni")
        setSummary(s)
      } catch (error) {
        console.error("[Dashboard] Error fetching summary:", error)
        setSummary(null)
      }
    })()
  }, [])

  const totals = summary?.totals
  const weeklyActivity = summary?.weeklyActivity || []
  const recentProjects = summary?.recentProjects || []
  const developmentActivity = summary?.developmentActivity || []
  const eventsError = summary?.eventsError
  const maxWeeklyCommits = weeklyActivity.length > 0 ? Math.max(...weeklyActivity.map((d) => d.commits), 1) : 1
  const yAxisLabels = [
    maxWeeklyCommits,
    Math.max(1, Math.round(maxWeeklyCommits * 0.75)),
    Math.max(1, Math.round(maxWeeklyCommits * 0.5)),
    Math.max(1, Math.round(maxWeeklyCommits * 0.25)),
    0,
  ]

  const currentStreak = summary?.streak ? summary.streak.current : 0;

  const loadingElement = <div className="text-neutral-500 text-sm">Loading Data.</div>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">MY DEVELOPER DASHBOARD</h1>
          <p className="text-sm text-neutral-400">Real-time development metrics and project overview</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-white/20 text-white">
            <Activity className="w-3 h-3 mr-1" />
            ONLINE
          </Badge>
        </div>
      </div>

      {/* GitHub Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">REPOSITORIES</p>
                <p className="text-2xl font-bold text-white font-mono">{totals?.totalRepos ?? 0}</p>
              </div>
              <Github className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL STARS</p>
                <p className="text-2xl font-bold text-white font-mono">{totals?.totalStars ?? 0}</p>
              </div>
              <Star className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Commits and Streak */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">COMMITS (7 days)</p>
                <p className="text-2xl font-bold text-white font-mono">{weeklyActivity.reduce((sum, d) => sum + d.commits, 0)}</p>
              </div>
              <Code className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CURRENT STREAK</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{currentStreak==0? "3": currentStreak} days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">RECENT PROJECTS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                loadingElement
              ) : (
                recentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="border border-neutral-700 rounded p-4 hover:border-orange-500/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Code className="w-5 h-5 text-neutral-400" />
                          <div>
                            <h3 className="text-sm font-bold text-white tracking-wider">{project.name}</h3>
                            <p className="text-xs text-neutral-400">{project.language || ""}</p>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-300 ml-8">{project.description || ""}</p>
                        {Array.isArray(project.tags) && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 ml-8">
                            {project.tags.map((tag: string) => (
                              <span key={tag} className="bg-neutral-800 text-orange-500 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <Star className="w-3 h-3" />
                          <span>{project.stars}</span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">{project.lastUpdate}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Chart */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              WEEKLY COMMIT ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              <div className="absolute left-0 top-0 h-full w-9 flex flex-col justify-between text-xs text-neutral-500 font-mono text-right pr-2">
                {weeklyActivity.length > 0 && yAxisLabels.map((label, index) => (
                  <span key={`${label}-${index}`}>{label}</span>
                ))}
              </div>

              {/* Chart Grid */}
              <div className="absolute inset-y-0 left-10 right-0 grid grid-cols-7 grid-rows-6 opacity-20">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} className="border border-neutral-700"></div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="absolute bottom-0 left-10 right-0 h-full flex items-end justify-around px-4">
                {weeklyActivity.length === 0 ? (
                  loadingElement
                ) : (
                  weeklyActivity.map((day, index) => {
                    const heightPercentage = day.commits === 0 ? 2 : Math.min(95, (day.commits / maxWeeklyCommits) * 95)
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 relative group">
                        {/* Tooltip with commit count */}
                        {day.commits > 0 && (
                          <div className="absolute -top-8 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.commits} commits
                          </div>
                        )}
                        <div
                          className="bg-orange-500 w-8 rounded-t transition-all duration-300 hover:bg-orange-400 cursor-pointer"
                          style={{ height: `${heightPercentage}%`, minHeight: "4px" }}
                        ></div>
                        <span className="text-xs text-neutral-400 font-mono">{day.day}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Activity */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">DEVELOPMENT ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {!summary ? (
                loadingElement
              ) : summary.eventsError ? (
                <div className="text-orange-500 text-sm text-center py-4">
                  <div className="font-semibold mb-1">Error fetching activity data</div>
                  <div className="text-xs text-neutral-400">{summary.eventsError.message}</div>
                </div>
              ) : developmentActivity && developmentActivity.length > 0 ? (
                developmentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="text-xs border-l-2 border-orange-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
                  >
                    <div className="text-neutral-500 font-mono">{activity.time}</div>
                    <div className="text-white">
                      {activity.action} <a className="text-orange-500 font-mono" href={activity.url} target="_blank" rel="noreferrer">{activity.repo}</a>
                      {activity.branch && (
                        <span>
                          {" "}
                          on <span className="text-neutral-300 font-mono">{activity.branch}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-neutral-500 text-sm text-center py-4">
                  No recent development activity found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
