"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Github, ExternalLink, Star, GitFork, Code, Calendar } from "lucide-react"
import type { Project } from "@/types/project"
import { personalProjects } from "@/data/personal-projects"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>(personalProjects)
  const [githubProfileUrl, setGithubProfileUrl] = useState<string>("https://github.com/benjamalegni")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/github/projects?username=benjamalegni", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          const repos: Project[] = Array.isArray(data.projects) ? data.projects : []
          setProjects((prev: Project[]) => {
            const existingKeys = new Set(prev.map((p: Project) => p.id))
            const merged: Project[] = [...prev]
            for (const repo of repos) {
              if (!existingKeys.has(repo.id)) merged.push(repo)
            }
            return merged
          })
          if (typeof data.username === "string" && data.username.length > 0) {
            setGithubProfileUrl(`https://github.com/${data.username}`)
          }
        }
      } catch {
        // silent fail
      }
    }
    load()
  }, [])

  const allTags = [...new Set(projects.flatMap((p: Project) => p.tags))]

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTag = selectedTag === "" || project.tags.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  const getProjectStatusBadgeClass = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-white/20 text-white"
      case "completed":
        return "bg-white/20 text-white"
      case "planning":
        return "bg-orange-500/20 text-orange-500"
      case "archived":
        return "bg-neutral-500/20 text-neutral-300"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">PROJECT PORTFOLIO</h1>
          <p className="text-sm text-neutral-400">Showcase of development projects and contributions</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => window.open(githubProfileUrl, "_blank") }>
            <Github className="w-4 h-4 mr-2" />
            View GitHub
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("")}
                className={
                  selectedTag === ""
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "border-neutral-600 text-neutral-400 hover:bg-neutral-800"
                }
              >
                All
              </Button>
              {allTags.slice(0, 6).map((tag: string) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className={
                    selectedTag === tag
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "border-neutral-600 text-neutral-400 hover:bg-neutral-800"
                  }
                >
                  {tag}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project: Project) => (
          <Card
            key={project.id}
            className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer overflow-hidden"
            onClick={() => setSelectedProject(project)}
          >
            <div className="aspect-video bg-neutral-800 relative overflow-hidden">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getProjectStatusBadgeClass(project.status)}>{project.status.toUpperCase()}</Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white tracking-wider">{project.name}</CardTitle>
                  <p className="text-xs text-neutral-400">{project.category}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-neutral-300 line-clamp-2">{project.description}</p>

              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} className="bg-neutral-800 text-orange-500 text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 4 && (
                  <Badge className="bg-neutral-800 text-neutral-400 text-xs">+{project.tags.length - 4}</Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    <span>{project.forks}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  <span>{project.language || ""}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {project.github && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.github!, "_blank")
                    }}
                  >
                    <Github className="w-3 h-3 mr-1" />
                    Code
                  </Button>
                )}
                {project.demo && (
                  <Button
                    size="sm"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.demo!, "_blank")
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Demo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedProject.name}</CardTitle>
                <p className="text-sm text-neutral-400">
                  {selectedProject.category} • {selectedProject.id}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedProject(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-neutral-800 rounded overflow-hidden">
                <img
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">PROJECT DETAILS</h3>
                    <p className="text-sm text-neutral-300 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">KEY FEATURES</h3>
                    <ul className="space-y-1">
                      {selectedProject.features.map((feature: string, index: number) => (
                        <li key={index} className="text-sm text-neutral-300 flex items-center gap-2">
                          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TECHNOLOGIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag: string) => (
                        <Badge key={tag} className="bg-neutral-800 text-orange-500">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATISTICS</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Language:</span>
                        <span className="text-white">{selectedProject.language || ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Stars:</span>
                        <span className="text-white font-mono">{selectedProject.stars}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Forks:</span>
                        <span className="text-white font-mono">{selectedProject.forks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Last Update:</span>
                        <span className="text-white font-mono">{selectedProject.lastUpdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Status:</span>
                        <Badge className={getProjectStatusBadgeClass(selectedProject.status)}>
                          {selectedProject.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                {selectedProject.github && (
                  <Button
                    className="bg-neutral-800 hover:bg-neutral-700 text-white"
                    onClick={() => window.open(selectedProject.github!, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source
                  </Button>
                )}
                {selectedProject.demo && (
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => window.open(selectedProject.demo!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                )}
                {selectedProject.github ? (
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                    onClick={() => window.open(`${selectedProject.github}/commits`, "_blank")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Timeline
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Timeline
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
