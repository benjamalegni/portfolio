'use client'

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { SectionId } from "./page"

type TopToolBarProps = {
  activeSection: SectionId
}

const DEFAULT_TRACK = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/music/theme.wav`

export function TopToolBar({ activeSection }: TopToolBarProps) {
  // load audios
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = muted
    audio.volume = muted ? 0 : 0.6

    if (!muted && audio.paused) {
      audio.play().catch(() => {
        // ignore autoplay errors caused by browser policies
      })
    }
  }, [muted])

  const handleVolumeClick = () => {
    setMuted((prev) => !prev)
  }

  return (
    <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="text-sm text-neutral-400">
          LUKA PORTFOLIO / <span className="text-orange-500">{activeSection.toUpperCase()}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleVolumeClick}
        className="text-neutral-400 hover:text-orange-500 transition-colors"
        aria-label={muted ? "Turn music on" : "Turn music off"}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <audio ref={audioRef} src={DEFAULT_TRACK} loop autoPlay muted />
    </div>
  )
}
