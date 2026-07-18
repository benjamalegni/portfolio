"use client"

import { useState } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import GlobeScene from "./GlobeScene"
import StarfieldBackground from "./StarfieldBackground"

type Props = {
  pointsGeometry: THREE.IcosahedronGeometry
}

export default function RotatingGlobe({ pointsGeometry }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <hemisphereLight args={[0xffffff, 0x080820, 3]} />
        <GlobeScene
          pointsGeometry={pointsGeometry}
          selected={selected}
          setSelected={setSelected}
        />
        <StarfieldBackground />
        <OrbitControls minDistance={2} enableDamping autoRotate={false} />
      </Canvas>
    </div>
  )
}
