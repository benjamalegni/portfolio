"use client"

import { useMemo } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

export default function StarfieldBackground() {
  const sprite = useTexture("/assets/globe/circle.png")

  const [geo, mat] = useMemo(() => {
    const numStars = 4500
    const positions = new Float32Array(numStars * 3)
    const colors = new Float32Array(numStars * 3)

    for (let i = 0; i < numStars; i++) {
      const radius = Math.random() * 25 + 25
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      const col = new THREE.Color().setHSL(0.6, 0.2, Math.random())
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      map: sprite,
      transparent: true,
      depthWrite: false,
    })

    return [geo, mat]
  }, [sprite])

  return <points geometry={geo} material={mat} />
}
