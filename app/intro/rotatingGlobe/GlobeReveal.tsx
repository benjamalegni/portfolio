"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import RotatingGlobe from "./RotatingGlobe"

const MIN_LOAD_MS = 3400
const PARTICLE_DETAIL = 120

export default function GlobeReveal() {
  const [phase, setPhase] = useState<"loading" | "entering" | "entered">("loading")
  const pointsGeoRef = useRef<THREE.IcosahedronGeometry | null>(null)

  useEffect(() => {
    const geo = new THREE.IcosahedronGeometry(1, PARTICLE_DETAIL)
    pointsGeoRef.current = geo
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setPhase("entering"), MIN_LOAD_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          phase === "loading" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,195,247,0.25) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)",
            animation: "glow-pulse 5.5s ease-in-out infinite",
          }}
        />
      </div>

      <div
        className={`absolute inset-0 transition-all duration-1000 ease-out ${
          phase === "loading"
            ? "opacity-0 blur-2xl scale-95"
            : "opacity-100 blur-0 scale-100"
        }`}
        style={{
          willChange: phase !== "entered" ? "opacity, filter, transform" : "auto",
        }}
        onTransitionEnd={() => {
          if (phase === "entering") setPhase("entered")
        }}
      >
        {phase !== "loading" && pointsGeoRef.current && (
          <RotatingGlobe pointsGeometry={pointsGeoRef.current} />
        )}
      </div>
    </div>
  )
}
