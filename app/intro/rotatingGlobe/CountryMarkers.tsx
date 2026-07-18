"use client"

import { useMemo, useRef, type Dispatch, type SetStateAction } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
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

export default function CountryMarkers({
  selected,
  setSelected,
}: {
  selected: string | null
  setSelected: Dispatch<SetStateAction<string | null>>
}) {
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
          <mesh
            onClick={(e) => {
              e.stopPropagation()
              setSelected((prev) => (prev === country ? null : country))
            }}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial visible={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.026, 16, 16]} />
            <meshStandardMaterial
              color="#7dd3fc"
              emissive="#38bdf8"
              emissiveIntensity={2.0}
              toneMapped={false}
            />
          </mesh>
          {selected === country && (
            <Html center distanceFactor={4}>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  color: "#e0f2fe",
                  padding: "4px 10px",
                  borderRadius: "2px",
                  fontSize: "13px",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {country}
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  )
}
