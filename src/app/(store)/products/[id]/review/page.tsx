import { Card } from "@/components/ui/card";
import { ReviewForm } from "../components/ReviewForm";


export default async function ProductReviewPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Card className="container mx-auto py-8 max-w-xl p-4 bg-card/70 backdrop-blur-md">
            <h1 className="text-2xl font-bold mb-4">Write a Review</h1>
            <ReviewForm productId={(await params).id} />
        </Card>
    )
}

