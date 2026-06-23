import { HeroSection } from "./_components/landing/hero-section"
import { SocialProofSection } from "./_components/landing/social-proof-section"
import { ProblemSolutionSection } from "./_components/landing/problem-solution-section"
import { HowItWorksSection } from "./_components/landing/how-it-works-section"
import { FeaturesSection } from "./_components/landing/features-section"
import { PickleballExampleSection } from "./_components/landing/pickleball-example-section"
import { FaqSection } from "./_components/landing/faq-section"
import { FinalCtaSection } from "./_components/landing/final-cta-section"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SocialProofSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PickleballExampleSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  )
}
