import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
    icon: React.ElementType
    title: string
    description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <Icon className="size-10 mb-2" />
        <h5>{title}</h5>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
