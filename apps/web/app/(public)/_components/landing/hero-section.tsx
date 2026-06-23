import { HeroContent } from "./motion/hero-content"
import { HeroDashboardPreview } from "./motion/hero-dashboard-preview"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-0 h-[min(600px,70vh)] w-[min(900px,120vw)] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          className="absolute -right-1/4 top-1/3 h-[400px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl"
        />
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <HeroContent />
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  )
}
