"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { countryCoordinates, type CountryCoordinate } from "@/data/countryCoordinates"
import { visitedCountries } from "@/data/visitedCountries"

const GLOBE_RADIUS = 1.08

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

function latLngToVector3({ lat, lng }: CountryCoordinate) {
  const phi = toRadians(90 - lat)
  const theta = toRadians(lng + 0)

  // Match Three.js' default equirectangular sphere orientation.
  return new THREE.Vector3(
    -GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta),
    GLOBE_RADIUS * Math.cos(phi),
    GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta)
  )
}

export default function CountryMarkers() {
  const markerRefs = useRef<(THREE.Group | null)[]>([])

  const markers = useMemo(
    () =>
      visitedCountries.flatMap((country) => {
        const coordinates = countryCoordinates[country]

        if (!coordinates) {
          return []
        }

        return [
          {
            country,
            position: latLngToVector3(coordinates),
          },
        ]
      }),
    []
  )

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()

    markerRefs.current.forEach((marker, index) => {
      if (!marker) {
        return
      }

      const scale = 1 + Math.sin(elapsed * 3 + index * 0.35) * 0.16
      marker.scale.setScalar(scale)
    })
  })

  return (
    <>
      {markers.map(({ country, position }, index) => (
        <group
          key={country}
          ref={(node) => {
            markerRefs.current[index] = node
          }}
          position={position}
        >
          <mesh>
            <sphereGeometry args={[0.026, 16, 16]} />
            <meshStandardMaterial
              color="#7dd3fc"
              emissive="#38bdf8"
              emissiveIntensity={2.0}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}
