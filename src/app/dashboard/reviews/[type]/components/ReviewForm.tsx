'use client'

import PageHeader from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { Product, Review } from '@/types/type'
import { ReviewSchema } from '@/lib/schema'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import BlurImage from '@/components/BlurImage'



interface ReviewDetailsProps {
    initialReview: Review,
}

type ReviewFormValues = z.infer<typeof ReviewSchema>;

export default function ReviewDetails({ initialReview }: ReviewDetailsProps) {
    return (
        <>
            <div className="space-y-8">
                <div className="space-y-4">
                    <PageHeader title="Review Details" />
                    <Card className="w-full mx-auto">
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating</label>
                                <Input
                                    value={initialReview.rating}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Comment</label>
                                <Textarea
                                    value={initialReview.comment!}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Created At</label>
                                <Input
                                    value={format(new Date(initialReview.created_at), 'PPP')}
                                    readOnly
                                />
                            </div>
                            {initialReview.images && initialReview.images.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image</label>
                                    {
                                        initialReview.images.map((image, index) => (
                                            <div key={index} className="relative w-40 aspect-square">
                                                <BlurImage
                                                    src={image.url}
                                                    alt="Review Image"
                                                    className="rounded-md aspect-square"
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    <PageHeader title="User Information" />
                    <Card className="w-full mx-auto">
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reviewer Name</label>
                                <Input
                                    value={initialReview.user.name!}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    value={initialReview.user.email!}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">User ID</label>
                                <Input
                                    value={initialReview.user.id}
                                    readOnly
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    <PageHeader title="Product Details" />
                    <Card className="w-full mx-auto">
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input
                                    value={initialReview.product.name}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product ID</label>
                                <Input
                                    value={initialReview.product.id}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Price</label>
                                <Input
                                    value={`${formatCurrency(initialReview.product.price)}`}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Category</label>
                                <Input
                                    value={initialReview.product.category_name}
                                    readOnly
                                />
                            </div>
                            {initialReview.product.images && initialReview.product.images.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Product Image</label>
                                    {
                                        initialReview.product.images.map((image, index) => (
                                            <div key={index} className="relative w-40 aspect-square">
                                                <BlurImage
                                                    src={image.url}
                                                    alt="Product Image"
                                                    className="rounded-md aspect-square"
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator />
        </>
    )
}

