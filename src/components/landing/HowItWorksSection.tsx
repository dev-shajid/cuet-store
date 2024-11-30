import { HowItWorksCard } from "./HowItWorksCard"

export function HowItWorksSection() {
    const steps = [
        { step: 1, title: "Create an Account", description: "Sign up using your CUET email and set up your profile." },
        { step: 2, title: "List or Browse", description: "Start listing your items or browse others' offerings." },
        { step: 3, title: "Buy or Sell", description: "Make purchases or sell securely through the platform." },
    ]

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 space-y-12 container">
            <h2 className="text-center">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3">
                {steps.map((step, index) => (
                    <HowItWorksCard key={index} {...step} />
                ))}
            </div>
        </section>
    )
}
