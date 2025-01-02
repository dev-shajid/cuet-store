'use client'

import AlertModal from '@/components/modal/AlertModal'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { useToast } from '@/hooks/use-toast'
import { createCategory, deleteCategory, updateCategory } from '@/lib/action'
import { CategorySchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import { TrashIcon, UploadCloudIcon } from 'lucide-react'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface CategoryFormProps {
    initialCategory: Category | null,
}

type CategoryFormValues = z.infer<typeof CategorySchema>;

export default function CategoryForm({ initialCategory }: CategoryFormProps) {
    const { toast } = useToast()
    const { onClose, onOpen } = useLoadingOverlay(state => state)
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()

    const title = initialCategory ? 'Edit Category' : 'Create New Category'
    const toastLoading = initialCategory ? 'Updating category...' : 'Creating category...'
    const action = initialCategory ? 'Save changes' : 'Create'

    const form = useForm<CategoryFormValues>({
        defaultValues: initialCategory ? {
            ...initialCategory,
            description: initialCategory.description ?? '',
        } : {
            name: '',
            description: 'just test description',
            is_featured: false,
            status: "ACTIVE",
            image: ''
        },
        resolver: zodResolver(CategorySchema)
    })

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            onOpen()
            setIsLoading(true)

            let res = await (
                initialCategory ?
                    updateCategory(initialCategory.id, values) :
                    createCategory(values)
            )

            console.log(res)

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                router.push(`/dashboard/categories`)
                router.refresh()
            }
        } catch (error) {
            toast({
                title: '❌ Error',
                description: "Something went wrong!"
            })

        } finally {
            onClose()
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        if (!initialCategory) return null;
        try {
            setIsLoading(true)

            const res = await deleteCategory(initialCategory.id)
            console.log({ deleteRes: res })

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                router.refresh()
                router.push(`/dashboard/categories`)
            }
        } catch (error) {
            toast({
                title: '❌ Error',
                description: "Something went wrong!"
            })

        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                title='Delete Category'
                description='Are you sure you want to delete this category?'
                onClose={() => setOpen(false)}
                isLoading={isLoading}
                onConfirm={onDelete}
            />
            <PageHeader
                title={title}
                button={initialCategory ? true : false}
                button_label='Delete'
                disabled={isLoading}
                variant='destructive'
                onClick={() => setOpen(true)}
            />


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='name'>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder='Category Name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='description'>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isLoading}
                                        placeholder='Category Description'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}

                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>Featured Product will be shown in Home Page</FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value == "ACTIVE"}
                                        onCheckedChange={(e) => field.onChange(e ? "ACTIVE" : "INACTIVE")}

                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Status</FormLabel>
                                    <FormDescription>Publish the Product</FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />


                    <div className="">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start space-y-3">
                                    {
                                        field.value ?
                                            <div className='relative w-[100px] rounded-md aspect-square overflow-hidden'>
                                                <div className='z-10 absolute top-2 right-2'>
                                                    <Button type='button' onClick={() => { }} size='icon' variant='destructive'>
                                                        <TrashIcon size={14} />
                                                    </Button>
                                                </div>
                                                <Image
                                                    src={field.value!}
                                                    alt='Image'
                                                    fill
                                                    className='object-cover w-full h-full'
                                                />
                                            </div> :
                                            null
                                    }
                                    <CldUploadWidget
                                        uploadPreset='pzyfwikc'
                                        onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                            if (typeof result.info === "object" && "secure_url" in result.info) {
                                                const url = result.info.secure_url;
                                                field.onChange(url)
                                            }
                                        }}
                                        options={{ multiple: false }}
                                    >
                                        {({ open }) => {
                                            const onClick = () => {
                                                open();
                                            }
                                            return (
                                                <div
                                                    onClick={onClick}
                                                    className='flex flex-col items-center justify-center w-full h-40 rounded-md border border-muted-foreground border-dashed text-muted-foreground cursor-pointer'
                                                >
                                                    <UploadCloudIcon size={40} />
                                                    Click to upload image
                                                </div>
                                            )
                                        }}
                                    </CldUploadWidget>
                                </FormItem>
                            )}
                        />

                    </div>

                    <Button disabled={isLoading} type='submit' className='ml-auto' size='sm'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}
