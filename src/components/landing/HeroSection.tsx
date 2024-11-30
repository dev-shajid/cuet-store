import { LinkButton } from "../ui/link-button"
import BlurImage from "../BlurImage"

export function HeroSection() {
  return (
    <>
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2 max-w-lg md:mx-left mx-auto text-center md:text-left">
            <h1>
              Welcome to CUET Student Marketplace
            </h1>
            <p className="mx-auto text-muted-foreground">
              Buy, sell, and connect with your fellow students. Your one-stop shop for all things CUET.
            </p>
            <LinkButton href="/store" size="lg" className="mt-6">
              Get Started
            </LinkButton>
          </div>
          <div className="relative">
            <BlurImage
              src="/banner.png"
              alt="Hero Image"
              className="d drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  )
}
