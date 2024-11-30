'use client'

import { Footer } from "@/components/landing/Footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeatureSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { JoinSection } from "@/components/landing/JoinSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <JoinSection />
      <Footer />
    </div>
  )
}
