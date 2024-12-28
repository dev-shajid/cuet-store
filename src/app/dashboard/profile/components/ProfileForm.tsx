'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Address, User } from '@prisma/client'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { ImageUpload } from './ImageUpload'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email(),
    role: z.string().min(2, 'Role must be at least 2 characters'),
    image: z.string().url('Invalid URL').optional().or(z.literal('')),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileDetailsProps {
    initialProfile: User & { addresses: Address[] }
}

export default function ProfileDetails({ initialProfile }: ProfileDetailsProps) {
    const { toast } = useToast()
    const { onClose, onOpen } = useLoadingOverlay()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialProfile.name || '',
            email: initialProfile.email || '',
            role: initialProfile.role || '',
            image: initialProfile.image || '',
            phone: initialProfile.phone || '',
        },
    })

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            onOpen()
            const res: ApiResponseType<null> = await updateUser(initialProfile.id, data)
            if (!res.success) throw new Error(res.message)
            toast({
                title: '✅ Success',
                description: 'Your profile has been successfully updated.',
            })
        } catch (error) {
            toast({
                title: '❌ Error',
                description: (error as Error)?.message ?? 'There was a problem updating your profile.',
                variant: 'destructive',
            })
        } finally {
            onClose()
        }
    }

    const handleImageUpload = (url: string) => {
        form.setValue('image', url)
    }

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="space-y-6 pt-6">
                    <PageHeader title="User Profile" />
                    <div className="flex flex-col items-center space-y-4">
                        <ImageUpload onImageUpload={handleImageUpload} currentImage={form.watch('image')} fallback={form.watch('name')?.charAt(0).toUpperCase()} />
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white' type="submit">Update Profile</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

