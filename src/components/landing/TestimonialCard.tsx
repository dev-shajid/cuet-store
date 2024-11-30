import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
    title: string
    description: string
    content: string
}

export function TestimonialCard({ title, description, content }: TestimonialCardProps) {
  return (
    <Card>
      <CardHeader>
        <h5>{title}</h5>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <div className="flex mt-4">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
