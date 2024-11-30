import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'

interface HowItWorksCardProps {
  step: number
  title: string
  description: string
}

export function HowItWorksCard({ step, title, description }: HowItWorksCardProps) {
  return (
    <Card className="bg-transparent shadow-none border-none flex flex-col items-center text-center">
      <CardHeader>
        <div className="flex size-12 text-muted items-center justify-center rounded-full bg-primary mb-4">
          {step}
        </div>
      </CardHeader>
      <CardContent>
        <h5 className="mb-2">{title}</h5>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
