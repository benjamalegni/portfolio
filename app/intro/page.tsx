import RotatingGlobe from "./rotatingGlobe/RotatingGlobe"

export default function IntroPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <p>countries i've visited</p>
        <RotatingGlobe />
      </div>
      <div className="relative z-10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">WHO AM I?</h1>
            <p className="text-sm text-neutral-400">Welcome to my portfolio</p>
          </div>
        </div>
      </div>
    </div>
  )
}
