export type Project = {
  id: string
  name: string
  description: string | null
  status: "active" | "completed" | "planning" | "archived"
  category: string
  tags: string[]
  stars: number
  forks: number
  language: string | null
  lastUpdate: string
  demo: string | null
  github: string | null
  image: string | null
  features: string[]
  isFork?: boolean
} 