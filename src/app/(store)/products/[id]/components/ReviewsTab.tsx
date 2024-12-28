import { Button } from '@/components/ui/button'
import { Star, PenLine } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Review, TableDataType } from '@/types/type'
import { toast } from '@/hooks/use-toast'
import { getReviews, getReviewsByProductId } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import BlurImage from '@/components/BlurImage'

export default function ReviewsTab({ productId, averageRating, totalReview }: { productId: string, averageRating: number, totalReview: number }) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [starDistribution, setStarDistribution] = useState([
        { stars: 5, percentage: 0 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
    ])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response: ApiResponseType<TableDataType<Review>> = await getReviewsByProductId(productId)
                if (response.success && response.data) {
                    setReviews(response?.data.data)
                    calculateStarDistribution(response.data.data)
                } else {
                    toast({
                        title: '❌ Error',
                        description: response.message
                    })
                }
            } catch (error) {
                toast({
                    title: '❌ Error',
                    description: error instanceof Error ? error?.message : 'Failed to fetch reviews'
                })
            }
        }

        fetchReviews()
    }, [productId])

    const calculateStarDistribution = (reviews: Review[]) => {
        const totalReviews = reviews.length
        const distribution = [0, 0, 0, 0, 0]

        reviews.forEach(review => {
            distribution[review.rating - 1] += 1
        })

        console.log(distribution)

        const starDist = distribution.map((count, index) => ({
            stars: index + 1,
            percentage: totalReviews ? (count / totalReviews) * 100 : 0
        }))

        setStarDistribution(starDist.reverse())
    }

    const filledStars = Math.floor(averageRating)
    const halfStar = averageRating % 1 !== 0
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0)

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center mb-4">
                            <span className="text-5xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                            <div className="flex flex-col">
                                <div className="flex">
                                    {[...Array(filledStars)].map((_, index) => (
                                        <Star key={index} className="h-6 w-6 text-yellow-500" fill="currentColor" />
                                    ))}
                                    {halfStar && <Star className="h-6 w-6 text-yellow-500" fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
                                    {[...Array(emptyStars)].map((_, index) => (
                                        <Star key={index} className="h-6 w-6 text-muted" fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Based on {totalReview} reviews
                                </span>
                            </div>
                        </div>
                        {starDistribution.map((item) => (
                            <div key={item.stars} className="flex items-center mb-2">
                                <span className="w-8 text-sm font-medium">{item.stars}</span>
                                <Star className="h-4 w-4 text-yellow-500 mr-2" fill="currentColor" />
                                <Progress value={item.percentage} className="h-2 flex-1" />
                                <span className="w-12 text-sm font-medium text-right">{item.percentage.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center bg-muted p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Share Your Thoughts</h3>
                        <p className="text-sm text-center mb-4">
                            Help others by sharing your experience with this product.
                        </p>
                        <Link href={`/products/${productId}/review`}>
                            <Button className="w-full">
                                <PenLine className="mr-2 h-4 w-4" />
                                Write a Review
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 flex gap-2">
                            <div>
                                <BlurImage
                                    src={review.user.image!}
                                    alt={review.user.name!}
                                    className="size-12 rounded-full"
                                />
                            </div>
                            <div className='flex-1'>
                                <p>
                                    <span className="font-semibold">{review.user.name}</span>
                                    <span className="text-muted-foreground text-xs"> - {review.created_at.toLocaleDateString()}</span>
                                </p>
                                <div className="flex items-center mb-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`h-4 w-4 ${index < review.rating ? 'text-yellow-500' : 'text-muted'}`}
                                                fill="currentColor"
                                            />
                                        ))}
                                    </div>
                                    {/* <span className="ml-2 text-sm font-medium text-muted-foreground">
                                        {review.rating} out of 5
                                    </span> */}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {review.comment}
                                </p>
                                {/* review images here */}
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {
                                            review.images.length ?
                                                review.images.map((image, index) => (
                                                    <BlurImage
                                                        key={index}
                                                        src={image.url}
                                                        alt={`Review image ${index + 1}`}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                ))
                                                : null
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </>
    )
}