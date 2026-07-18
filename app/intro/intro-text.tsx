"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./intro-text.module.css"

const DELAYS = [0, 1.0, 1.7, 2.5, 3.0]

const ITEMS = [
  { as: "h1" as const, text: "who am I?", className: "text-5xl sm:text-8xl font-bold text-white" },
  { as: "p" as const, text: "I'm full stack software engineer specialized on applied AI and cybersecurity.", className: "text-md text-neutral-400" },
  { as: "p" as const, text: "You can call me Luka :)", className: "text-md text-neutral-300" },
  { as: "p" as const, text: "On your right you can see the countries I've visited.", className: "text-sm text-neutral-100" },
  { as: "button" as const, text: "go to my portfolio", className: "hover:bg-blue-800 text-white font-bold py-2 px-8 underline underline-offset-1" },
] as const

export default function IntroText() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/dashboard")
  }, [router])

  return (
    <div className="gap-4 p-4 space-y-12">
      {ITEMS.map((item, i) => {
        const delay = DELAYS[i]
        const isButton = item.as === "button"
        return (
          <div key={i} className={styles.item}>
            {isButton ? (
              <button
                className={`${item.className} ${styles.text}`}
                style={{ animationDelay: `${delay}s` }}
                onClick={() => router.push("/dashboard")}
              >
                {item.text}
              </button>
            ) : (
              <item.as
                className={`${item.className} ${styles.text}`}
                style={{ animationDelay: `${delay}s` }}
              >
                {item.text}
              </item.as>
            )}
          </div>
        )
      })}
    </div>
  )
}
