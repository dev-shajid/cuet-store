import { Store, ShoppingBag, DollarSign } from "lucide-react"
import { FeatureCard } from "./FeatureCard"
import { FadeDown, FadeUp } from "../Animations"

export function FeaturesSection() {
  const features = [
    { icon: Store, title: "Personal Store", description: "Create your own store and showcase your products." },
    { icon: ShoppingBag, title: "Easy Buying", description: "Browse and purchase items easily." },
    { icon: DollarSign, title: "Secure Transactions", description: "Enjoy safe transactions with integrated payments." },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="space-y-12 container">
        <FadeDown>
        <h2 className="text-center">Key Features</h2>
        </FadeDown>
        <FadeUp>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        </FadeUp>
      </div>
    </section>
  )
}
