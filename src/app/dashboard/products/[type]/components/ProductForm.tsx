'use client'

import AlertModal from '@/components/modal/AlertModal'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { useToast } from '@/hooks/use-toast'
import { createProduct, deleteProduct, deleteProductImage, getCategories, seedProducts, updateProduct } from '@/lib/action'
import { ProductSchema } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { ImageType, Product } from '@/types/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, ProductMedia, PublishStatus } from '@prisma/client'
import { Check, ChevronsUpDown, ImagePlusIcon, TrashIcon, UploadCloudIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'


interface ProductFormProps {
    initialProduct: Partial<Product> | null,
}

type ProductFormValues = z.infer<typeof ProductSchema>;

export default function ProductForm({ initialProduct }: ProductFormProps) {
    const { toast } = useToast()
    const { onClose, onOpen } = useLoadingOverlay(state => state)
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [productImages, setProductImages] = useState<string[]>([])
    const [initialProductImages, setInitialProductImages] = useState<ProductMedia[]>(initialProduct?.images ?? [])

    const title = initialProduct ? 'Edit Product' : 'Create New Product'
    const action = initialProduct ? 'Save changes' : 'Create'

    const form = useForm<ProductFormValues>({
        defaultValues: initialProduct ?
            {
                ...initialProduct,
                description: initialProduct.description ?? '',
                price: Number(initialProduct.price),
            } :
            {
                name: '',
                description: 'just test description',
                is_featured: false,
                price: 0,
                stock: 0,
                status: PublishStatus.ACTIVE,
                category_name: '',
            },
        resolver: zodResolver(ProductSchema)
    })

    const onSubmit = async (values: ProductFormValues) => {
        try {
            onOpen()
            setIsLoading(true)

            let res = await (
                initialProduct ?
                    updateProduct(initialProduct.id, { ...values, images: productImages }) :
                    createProduct({ ...values, images: productImages })
            )

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                router.push(`/dashboard/products`)
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
        if (!initialProduct) return null;
        try {
            setIsLoading(true)

            const res = await deleteProduct(initialProduct.id)
            console.log({ deleteRes: res })

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                router.refresh()
                router.push(`/dashboard/products`)
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

    const removeInitialProductImage = async (currentImage: ImageType) => {
        if (!initialProduct) return null;
        try {
            setIsLoading(true)

            const res = await deleteProductImage(currentImage.id)

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                setInitialProductImages((prevImages) => prevImages.filter((e) => e.id !== currentImage.id))
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



    const onUpload = (result: CloudinaryUploadWidgetResults) => {
        console.log(result.info)
        if (result.info && typeof result.info !== 'string' && result.info.secure_url) {
            const url = result.info.secure_url;
            console.log({ url })
            setProductImages((prev) => [...prev, url])
        }
    }

    return (
        <>

            {/* <Button
                onClick={async () => {
                    await seedProducts()
                }}
            >
                Add Products
            </Button> */}
            
            <AlertModal
                isOpen={open}
                title='Delete Product'
                description='Are you sure you want to delete this product?'
                onClose={() => setOpen(false)}
                isLoading={isLoading}
                onConfirm={onDelete}
            />
            <PageHeader
                title={title}
                button={initialProduct ? true : false}
                button_label='Delte'
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
                                        placeholder='Product Name'
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
                                        placeholder='Product Description'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='price'>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        min={0}
                                        type='number'
                                        disabled={isLoading}
                                        placeholder='Product Price'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='stock'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='stock'>Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        min={0}
                                        type='number'
                                        disabled={isLoading}
                                        placeholder='Product Stock'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ProductCategoryInputField
                        form={form}
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

                    {initialProductImages?.length ?
                        <Card>
                            <CardHeader>
                                Product Image
                            </CardHeader>
                            <CardContent className='flex items-center gap-4 flex-wrap'>
                                {
                                    initialProductImages?.map((image, index) => (
                                        <div key={index} className='relative w-[100px] rounded-md aspect-square overflow-hidden'>
                                            <AlertModal
                                                isOpen={open}
                                                title='Delete Product'
                                                description='Are you sure you want to delete this product?'
                                                onClose={() => setOpen(false)}
                                                isLoading={isLoading}
                                                onConfirm={() => removeInitialProductImage(image)}
                                            />
                                            <div className='z-10 absolute top-2 right-2'>
                                                <Button type='button' onClick={() => setOpen(true)} size='icon' variant='destructive'>
                                                    <TrashIcon size={14} />
                                                </Button>
                                            </div>
                                            <Image
                                                src={image.url}
                                                alt='Image'
                                                fill
                                                className='object-cover w-full h-full'
                                            />
                                        </div>
                                    ))
                                }
                            </CardContent>
                        </Card> : null}

                    <div className="">
                        <div className='mb-4 flex items-center gap-4'>
                            {productImages?.map((url, index) => (
                                <div key={index} className='relative w-[100px] rounded-md aspect-square overflow-hidden'>
                                    <div className='z-10 absolute top-2 right-2'>
                                        <Button type='button' onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))} size='icon' variant='destructive'>
                                            <TrashIcon size={14} />
                                        </Button>
                                    </div>
                                    <Image
                                        src={url}
                                        alt='Image'
                                        fill
                                        className='object-cover w-full h-full'
                                    />
                                </div>
                            ))}
                        </div>
                        <CldUploadWidget
                            uploadPreset='pzyfwikc'
                            onSuccess={onUpload}
                        >
                            {({ open }) => (
                                    <div
                                        onClick={() => open()}
                                        className='flex flex-col items-center justify-center w-full h-40 rounded-md border border-muted-foreground border-dashed text-muted-foreground cursor-pointer'
                                    >
                                        <UploadCloudIcon size={40} />
                                        Click to upload images
                                    </div>
                                )
                            }
                        </CldUploadWidget>
                    </div>



                    <Button disabled={isLoading} type='submit' className='ml-auto' size='sm'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}

function ProductCategoryInputField({ form }: { form: UseFormReturn<ProductFormValues> }) {

    const [categories, setCategories] = useState<Partial<Category[]>>([])

    const fetchCategories = async () => {
        const res = await getCategories({ limit: 100 });
        setCategories(res.data.data)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <FormField
            control={form.control}
            name="category_name"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                    <FormLabel>Category</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}

                                >
                                    {field.value
                                        ? categories.find(
                                            (category) => category?.name === field.value
                                        )?.name
                                        : "Select category"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search Category..."
                                />
                                <CommandList>
                                    <CommandEmpty>No category found.</CommandEmpty>
                                    <CommandGroup>
                                        {
                                            (categories
                                                // .filter((category) => category?.name?.toLowerCase().includes(field.value.toLowerCase()))
                                            )
                                                .map((category) => (
                                                    <CommandItem
                                                        value={category?.name}
                                                        key={category?.name}
                                                        onSelect={() => {
                                                            form.setValue("category_name", category?.name!);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                category?.name === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {category?.name}
                                                    </CommandItem>
                                                ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}