"use client"

import { useEffect, useState } from "react"

export function DashboardBackground() {
  const [mouseX, setMouseX] = useState(0.5)
  const [mouseY, setMouseY] = useState(0.5)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseX(e.clientX / window.innerWidth)
      setMouseY(e.clientY / window.innerHeight)
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-800" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249,115,22,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute w-96 h-96 bg-neutral-500 rounded-full blur-[120px] transition-transform duration-300 ease-out"
        style={{
          left: `${mouseX * 100}%`,
          top: `${mouseY * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] transition-transform duration-500 ease-out"
        style={{
          left: `${(1 - mouseX) * 100}%`,
          top: `${(1 - mouseY) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
