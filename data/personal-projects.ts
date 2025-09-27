import type { Project } from "@/types/project_type"

export const personalProjects: Project[] = [
  {
    id: "PERSONAL-001",
    name: "Portfolio",
    description: "Personal portfolio built with Next.js and Tailwind CSS",
    status: "active",
    category: "Web",
    tags: ["#nextjs", "#react", "#tailwind", "#cloudflareWorker", "#expressJS"],
    stars: 0,
    forks: 0,
    language: "TypeScript",
    lastUpdate: new Date().toISOString().slice(0, 10),
    demo: null,
    github: null,
    image: "/portfolio-preview.png",
    features: ["Responsive design", "Dark mode", "Dynamic content"],
  },
] 