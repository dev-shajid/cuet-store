"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { TrashIcon, UploadCloudIcon } from 'lucide-react'
import { createReview } from "@/lib/action"
import { useRouter } from "next/navigation"
import { ReviewSchema } from "@/lib/schema"

type ReviewFormValues = z.infer<typeof ReviewSchema>

export function ReviewForm({ productId }: { productId: string }) {
    const { toast } = useToast()
    const [images, setImages] = useState<string[]>([])

    const router = useRouter()

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            rating: Number('1'),
            comment: "",
        },
    })

    const onSubmit = async (values: ReviewFormValues) => {
        try {
            // Here you would typically send the review data to your backend
            const res = await createReview(productId, { ...values, images })
            console.log(res)
            if (!res.success) throw new Error(res.message ?? "Failed to submit review")
            toast({
                title: "✅ Review submitted",
                description: res.message ?? "Thank you for your feedback!",
            })
            form.reset()
            setImages([])

            router.push(`/products/${productId}`)

        } catch (error) {
            toast({
                title: "❌ Error",
                description: (error instanceof Error ? error.message : "Something went wrong. Please try again."),
            })
        }
    }

    const onUpload = (result: any) => {
        if (result.info && typeof result.info !== "string" && result.info.secure_url) {
            const url = result.info.secure_url
            setImages((prev) => [...prev, url])
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    {...field}
                                    // onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                    placeholder="Rate the product from 1 to 5 stars"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Write your review here" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <div className="mb-4 flex items-center gap-4">
                        {images.map((url, index) => (
                            <div key={index} className="relative w-[100px] rounded-md aspect-square overflow-hidden">
                                <div className="z-10 absolute top-2 right-2">
                                    <Button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))} size="icon" variant="destructive">
                                        <TrashIcon size={14} />
                                    </Button>
                                </div>
                                <Image src={url} alt="Review image" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                    <CldUploadWidget uploadPreset="pzyfwikc" onSuccess={onUpload}>
                        {({ open }) => (
                            <div
                                onClick={() => open()}
                                className="flex flex-col items-center justify-center w-full h-40 rounded-md border border-muted-foreground border-dashed text-muted-foreground cursor-pointer"
                            >
                                <UploadCloudIcon size={40} />
                                Click to upload images
                            </div>
                        )}
                    </CldUploadWidget>
                </div>
                <Button type="submit">Submit Review</Button>
            </form>
        </Form>
    )
}

