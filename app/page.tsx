import GlobeReveal from "./intro/rotatingGlobe/GlobeReveal"
import IntroText from "./intro/intro-text"

export default function HomePage() {
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <div className="relative z-10 flex flex-col gap-4 m-14">
        <IntroText />
      </div>
      <aside className="relative z-0 w-full h-full flex flex-col items-center justify-center gap-4">
        <GlobeReveal />
      </aside>
    </div>
  )
}
