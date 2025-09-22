import { Monitor, Settings, Shield, Target, Users } from "lucide-react"
import { Dispatch, SetStateAction } from "react";
import { SectionId } from "./page";

type Props = {
  activeSection: SectionId;
  setActiveSection: Dispatch<SetStateAction<SectionId>>;
  sidebarCollapsed?: boolean;
}

type Item = {
  id: SectionId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};


export function NavSide({activeSection, setActiveSection, sidebarCollapsed}:Props){
    const items:Item[] = [
                { id: "overview", icon: Monitor, label: "DASHBOARD" },
                { id: "projects", icon: Target, label: "PROJECTS" },
                { id: "skills", icon: Shield, label: "SKILLS & STATS" },
                { id: "experience", icon: Users, label: "EXPERIENCE" },
                { id: "contact", icon: Settings, label: "CONTACT" },
              ]

    return(
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
                >
                  <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
            )
          )
        }
      </nav>
    )
  }