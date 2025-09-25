import { ChevronRight, Monitor, Settings, Shield, Target, Users } from "lucide-react"
import { Dispatch, SetStateAction } from "react";
import { SectionId } from "./page";
import { Project } from "@/types/project_type";

type Props = {
  activeSection: SectionId,
  setActiveSection: Dispatch<SetStateAction<SectionId>>,
  sidebarCollapsed?: boolean,
  activeProjects: number,
  commitsThisYear: number,
  setSideBarCollapsed: Dispatch<SetStateAction<boolean>>,
}

type Item = {
  id: SectionId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

const iconSize = "w-4 h-4 sm:w-5 sm:h-5"

export function NavSide({activeSection, setActiveSection, sidebarCollapsed, activeProjects, commitsThisYear, setSideBarCollapsed}:Props){
    const items:Item[] = [
                { id: "overview", icon: Monitor, label: "DASHBOARD" },
                { id: "projects", icon: Target, label: "PROJECTS" },
                { id: "skills", icon: Shield, label: "SKILLS & STATS" },
                { id: "experience", icon: Users, label: "EXPERIENCE" },
                { id: "contact", icon: Settings, label: "CONTACT" },
              ]


    const handleClick =(setSideBarCollapsed:Dispatch<SetStateAction<boolean>>) => {
      setSideBarCollapsed(!sidebarCollapsed)
    }

    const videoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/videos/welcome_3Dface.webm`

    return(
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col">
          {/* top nav */}
          <div className="mb-8 space-y-5">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-xl tracking-wider">LUKA PORTFOLIO</h1>
            </div>

            <button
              type="button"
              onClick={() => handleClick(setSideBarCollapsed)}
              className={`w-full flex items-center gap-3 p-3 rounded transition-colors hover:text-white hover:bg-neutral-800 ${sidebarCollapsed ? "justify-center" : ""}`}
              aria-label="Toggle sidebar"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </button>
          </div>

          {/* bottom nav */}
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
                title={item.label}
              >
                <item.icon className={`icon-size`} />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 rounded border border-neutral-700 bg-neutral-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                <span className="text-xs text-white">SYSTEM ONLINE</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>PROJECTS: {activeProjects} ACTIVE</div>
                <div>COMMITS: {commitsThisYear.toLocaleString()} THIS YEAR</div>
              </div>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <div
            className="mt-6 overflow-hidden rounded-lg border border-neutral-700"
            style={{ aspectRatio: "16 / 9" }}
          >
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    )
  }
