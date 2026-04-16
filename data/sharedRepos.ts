import type { Project } from "@/types/project_type"

export const sharedRepos: Project[] = [
	{
		id: "shared-upstream-collab-portfolio-kit",
		name: "Interview Quiz",
		description:
			"A collaborative project built during the Midudev Hackathon, showcasing a quiz application developed using Next.js, TypeScript, and Tailwind CSS. The project features a set of questions with realtime answer validation using local AI.",	
        status: "active",
		category: "Collaborative",
		tags: ["Next.js", "TypeScript", "Tailwind", "Collaboration", "Hackathon"],
		stars: 2,
		forks: 0,
		language: "TypeScript",
		lastUpdate: "2026-04-15",
		demo: "https://interviewquiz.404.mn/",
		github:"https://github.com/Juanma7882/hackaton-midu",
		image: "/interview-quiz-preview.png",
		features: [
			"Contributed responsive UI components",
			"Implemented project filtering and tagging",
			"Improved loading and error states",
		],
		isFork: false,
		pinned: false,
	},
]