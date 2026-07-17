"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

const vertexShader = `
  uniform float size;
  uniform sampler2D elevTexture;
  uniform vec2 mouseUV;

  varying vec2 vUv;
  varying float vVisible;
  varying float vDist;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    float elv = texture2D(elevTexture, vUv).r;
    vec3 vNormal = normalMatrix * normal;
    vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
    mvPosition.z += 0.30 * elv;

    float dist = distance(mouseUV, vUv);
    float zDisp = 0.0;
    float thresh = 0.01;
    if (dist < thresh) {
      zDisp = (thresh - dist) * 1.0;
    }
    vDist = dist;
    mvPosition.z += zDisp;

    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform sampler2D colorTexture;
  uniform sampler2D alphaTexture;
  uniform sampler2D otherTexture;

  varying vec2 vUv;
  varying float vVisible;
  varying float vDist;

  void main() {
    if (floor(vVisible + 0.1) == 0.0) discard;
    float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
    vec3 color = texture2D(colorTexture, vUv).rgb;
    vec3 other = texture2D(otherTexture, vUv).rgb;
    float thresh = 0.04;
    if (vDist < thresh) {
      color = mix(color, other, (thresh - vDist) * 20.0);
    }
    gl_FragColor = vec4(color, alpha);
  }
`

export default function GlobeScene() {
  const { pointer, raycaster, camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const globeUV = useRef(new THREE.Vector2(0, 0))

  const [colorMap, elevMap, alphaMap, otherMap] = useTexture([
    "/assets/globe/00_earthmap1k.jpg",
    "/assets/globe/01_earthbump1k.jpg",
    "/assets/globe/02_earthspec1k.jpg",
    "/assets/globe/04_rainbow1k.jpg",
  ])

  const wireframeGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 16), [])
  const pointsGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 120), [])

  const uniforms = useMemo(() => ({
    size: { value: 2.5 },
    colorTexture: { value: colorMap },
    otherTexture: { value: otherMap },
    elevTexture: { value: elevMap },
    alphaTexture: { value: alphaMap },
    mouseUV: { value: new THREE.Vector2(0, 0) },
  }), [colorMap, otherMap, elevMap, alphaMap])

  const shaderMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  }), [uniforms])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(wireframeRef.current!, false)
    if (intersects.length > 0) {
      globeUV.current.copy(intersects[0].uv!)
    }
    uniforms.mouseUV.value = globeUV.current
  })

  return (
    <group ref={groupRef}>
      <mesh ref={wireframeRef} geometry={wireframeGeo}>
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <points geometry={pointsGeo} material={shaderMat} />
    </group>
  )
}
