"use client"

import { SetStateAction, useState } from "react"
import DashboardPage from "./dashboard/dashboard"
import ProjectsPage from "./projects/projects"
import SkillsPage from "./skills/skills"
import ExperiencePage from "./experience/experience"
import ContactPage from "./contact/contact"
import { useEffect } from "react"
import { fetchUserRepos, fetchUserEvents } from "@/lib/github"
import { NavSide } from "./navside"
import { TopToolBar } from "./toptoolbar"
import "./globals.css"

export type SectionId = "overview" | "projects" | "skills" | "experience" | "contact";

export default function CyberpunkPortfolio() {
  const [activeSection, setActiveSection] = useState<SectionId>("projects")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeProjects, setActiveProjects] = useState(0)
  const [commitsThisYear, setCommitsThisYear] = useState(0)

  const username = "benjamalegni"

  // retrieve personal gh data
  useEffect(() => {
    async function load() {
      try {
        const [repos, events] = await Promise.all([
          fetchUserRepos(username),
          fetchUserEvents(username),
        ])
        const active = repos.filter((r) => !r.isFork && r.status !== "archived").length
        setActiveProjects(active)
        const currentYear = new Date().getFullYear()
        const ownRepoPrefix = `${username}/`
        const commits = events
          .filter((e) => 
            e.type === "PushEvent" && 
            e.repoName.startsWith(ownRepoPrefix) &&
            new Date(e.createdAt).getFullYear() === currentYear
          )
          .reduce((sum, e) => sum + e.commits, 0)
        setCommitsThisYear(commits)
      } catch {
        // ignore errors, keep defaults
      }
    }
    load()
  }, [])



  return (
      <div className="retro-crt flex h-screen overflow-hidden">
        
        {/* mobile overlay */}
        {!sidebarCollapsed && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
        )}

        {/* sidebar */}
        <div
          className={`${sidebarCollapsed ? "w-22" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 flex md:relative z-50 md:z-auto h-full`}
        >
          <div className="flex h-full min-h-0 flex-col p-4">
            <NavSide
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              sidebarCollapsed={sidebarCollapsed}
              activeProjects={activeProjects}
              commitsThisYear={commitsThisYear}
              setSideBarCollapsed={setSidebarCollapsed}
              />
            

          </div>
        </div>


        {/* main page router */}
        <div className={`flex-1 min-h-0 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
          <TopToolBar activeSection={activeSection}/>

          <div className="flex-1 overflow-auto min-h-0">
            {activeSection === "overview" && <DashboardPage />}
            {activeSection === "projects" && <ProjectsPage />}
            {activeSection === "skills" && <SkillsPage />}
            {activeSection === "experience" && <ExperiencePage />}
            {activeSection === "contact" && <ContactPage />}
          </div>
        </div>
      </div>
  )
}
