"use client"

import { useCallback, useMemo, useRef } from "react"

const FPS = 60
const X_STEPS = 25
const Y_STEPS = 25

type Props = {
  src: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function EyeBallzSidebarVideo({ src }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const centerTime = useMemo(() => {
    const centerX = Math.floor(X_STEPS / 2)
    const centerY = Math.floor(Y_STEPS / 2)
    const frameIndex = centerY * X_STEPS + centerX
    return frameIndex / FPS
  }, [])

  const seekToFrame = useCallback((normalizedX: number, normalizedY: number) => {
    const video = videoRef.current
    if (!video || video.readyState < 1) {
      return
    }

    const xIndex = Math.round(clamp(normalizedX, 0, 1) * (X_STEPS - 1))
    const yIndex = Math.round(clamp(normalizedY, 0, 1) * (Y_STEPS - 1))
    const frameIndex = yIndex * X_STEPS + xIndex
    const frameTime = frameIndex / FPS

    if (Math.abs(video.currentTime - frameTime) > 0.01) {
      video.currentTime = frameTime
    }
  }, [])

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const normalizedX = (clientX - rect.left) / rect.width
    const normalizedY = (clientY - rect.top) / rect.height

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      seekToFrame(normalizedX, normalizedY)
    })
  }, [seekToFrame])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    updateFromPointer(event.clientX, event.clientY)
  }, [updateFromPointer])

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    const centerNormalizedX = Math.floor(X_STEPS / 2) / (X_STEPS - 1)
    const centerNormalizedY = Math.floor(Y_STEPS / 2) / (Y_STEPS - 1)
    seekToFrame(centerNormalizedX, centerNormalizedY)
  }, [seekToFrame])

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative w-full overflow-hidden rounded-md border border-orange-500/30 bg-neutral-950/80"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(event) => {
          event.currentTarget.pause()
          event.currentTarget.currentTime = centerTime
        }}
        className="block h-48 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-orange-300/90">
        track gaze
      </div>
    </div>
  )
}
