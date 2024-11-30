import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function JoinSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-12">
                        <h2 className="text-center">Join CUET Marketplace Today</h2>
                        <p className="mx-auto max-w-[600px] md:text-lg text-muted-foreground">
                            Start buying, selling, and connecting with your fellow CUET students. Its free to join!
                        </p>
                    </div>
                    <Button size="lg" variant='gradient'>
                        Sign Up Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
