import { TestimonialCard } from "./TestimonialCard"

export function TestimonialsSection() {
  const testimonials = [
    { title: "Amazing Platform!", description: "CUET Student", content: `"This marketplace has made buying and selling so much easier."` },
    { title: "Very Useful!", description: "CUET Student", content: `"I've found great deals on this platform!"` },
    { title: "Highly Recommended!", description: "CUET Student", content: `"I love how convenient and secure this marketplace is."` },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="space-y-12 container">
        <h2 className="text-center">What Students Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
