"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import GlobeScene from "./GlobeScene"
import StarfieldBackground from "./StarfieldBackground"

export default function RotatingGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <hemisphereLight args={[0xffffff, 0x080820, 3]} />
        <GlobeScene />
        <StarfieldBackground />
        <OrbitControls enableDamping autoRotate={false} />
      </Canvas>
    </div>
  )
}
