"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { resume } from "@/data/resume"
import { buildGithubSummary } from "@/lib/github-summary"

export default function AgentNetworkPage() {
  const [topLanguages, setTopLanguages] = useState<{ name: string; percentage: number }[]>([])
  const [githubTotals, setGithubTotals] = useState<{ totalRepos: number; totalStars: number } | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const s = await buildGithubSummary("benjamalegni")
        setTopLanguages(s.topLanguages)
        setGithubTotals(s.totals)
      } catch {}
    })()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SKILLS & STATISTICS</h1>
          <p className="text-sm text-neutral-400">Technical skills and GitHub statistics</p>
        </div>
      </div>

      {/* Programming Languages (Top Languages from GitHub) */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PROGRAMMING LANGUAGES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topLanguages.length === 0 ? (
            <p className="text-neutral-500 text-sm">No language data available.</p>
          ) : (
            topLanguages.map((lang) => (
              <div key={lang.name} className="flex items-center justify-between">
                <span className="text-white">{lang.name}</span>
                <Progress value={lang.percentage} className="w-1/2" />
                <span className="text-neutral-400">{lang.percentage}%</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resume: Soft Skills */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SOFT SKILLS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {resume.softSkills.map((s) => (
            <p key={s} className="text-sm text-neutral-300">
              {s}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Resume: Technical Skills */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TECHNICAL SKILLS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xs font-medium text-neutral-400 tracking-wider mb-2">Languages / Tools</h3>
            <div className="flex flex-wrap gap-2">
              {resume.technicalSkills.languagesTools.map((t) => (
                <span key={t} className="bg-neutral-800 text-orange-500 text-xs px-2 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-neutral-400 tracking-wider mb-2">Networking</h3>
            <ul className="list-disc list-inside space-y-1">
              {resume.technicalSkills.networking.map((n) => (
                <li key={n} className="text-sm text-neutral-300">
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium text-neutral-400 tracking-wider mb-2">Mathematical Background</h3>
            <div className="flex flex-wrap gap-2">
              {resume.technicalSkills.mathematicalBackground.map((m) => (
                <span key={m} className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-neutral-400 tracking-wider mb-2">SDLC</h3>
            <ul className="list-disc list-inside space-y-1">
              {resume.technicalSkills.sdlc.map((v) => (
                <li key={v} className="text-sm text-neutral-300">
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">INTERESTS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {resume.interests.map((i) => (
            <span key={i} className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded">
              {i}
            </span>
          ))}
        </CardContent>
      </Card>

      {/* GitHub Statistics (basic numbers) */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">GITHUB STATISTICS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {githubTotals ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-white">Public Repositories:</span>
                <span className="text-neutral-400">{githubTotals.totalRepos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Stars:</span>
                <span className="text-neutral-400">{githubTotals.totalStars}</span>
              </div>
            </>
          ) : (
            <p className="text-neutral-500 text-sm">No GitHub statistics available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
