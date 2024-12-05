'use client'

import AlertModal from '@/components/modal/AlertModal'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from "date-fns"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { useToast } from '@/hooks/use-toast'
import { createSliderContent, deleteSliderContent, getProducts, updateSliderContent } from '@/lib/action'
import { SliderContentSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SliderContent } from '@prisma/client'
import { CalendarIcon, Check, ChevronsUpDown, Search, TrashIcon, UploadCloudIcon, X } from 'lucide-react'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Product } from '@/types/type'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import useDebounce from '@/hooks/use-debounce'

interface SliderContentFormProps {
    initialSliderContent: SliderContent | undefined,
}

type SliderContentFormValues = z.infer<typeof SliderContentSchema>;

export default function SliderContentForm({ initialSliderContent }: SliderContentFormProps) {
    const { toast } = useToast()
    const { onClose, onOpen } = useLoadingOverlay(state => state)
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()

    const title = initialSliderContent ? 'Edit SliderContent' : 'Create New SliderContent'
    const toastLoading = initialSliderContent ? 'Updating sliderContent...' : 'Creating sliderContent...'
    const action = initialSliderContent ? 'Save changes' : 'Create'

    const form = useForm<SliderContentFormValues>({
        defaultValues: initialSliderContent ? {
            ...initialSliderContent,
            description: initialSliderContent.description ?? '',
        } : {
            title: '',
            description: '',
            tag: '',
            product_id: '',
            status: "INACTIVE",
            start_at: new Date(),
            end_at: new Date(),
        },
        resolver: zodResolver(SliderContentSchema)
    })

    const onSubmit = async (values: SliderContentFormValues) => {
        try {
            onOpen()
            setIsLoading(true)

            let res = await (
                initialSliderContent ?
                    updateSliderContent(initialSliderContent.id, values) :
                    createSliderContent(values)
            )

            console.log(res)

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                router.refresh()
                router.push(`/dashboard/slides`)
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
        if (!initialSliderContent) return null;
        try {
            setIsLoading(true)

            const res = await deleteSliderContent(initialSliderContent.id)
            console.log({ deleteRes: res })

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                router.refresh()
                router.push(`/dashboard/slides`)
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
                title='Delete SliderContent'
                description='Are you sure you want to delete this sliderContent?'
                onClose={() => setOpen(false)}
                isLoading={isLoading}
                onConfirm={onDelete}
            />
            <PageHeader
                title={title}
                button={initialSliderContent ? true : false}
                button_label='Delete'
                disabled={isLoading}
                variant='destructive'
                onClick={() => setOpen(true)}
            />


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='title'>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder='SliderContent Title'
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
                                        placeholder='SliderContent Description'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='tag'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='tag'>Tag</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder='SliderContent Tag'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ProductFilterInputField form={form} />
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

                    <FormField
                        control={form.control}
                        name="start_at"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start At</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Your date of birth is used to calculate your age.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_at"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End At</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Your date of birth is used to calculate your age.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} type='submit' className='ml-auto' size='sm'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export function ProductFilterInputField({ form }: { form: UseFormReturn<SliderContentFormValues> }) {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const fetchProducts = async (query = '') => {
        const res = await getProducts({ limit: 20, search: query })
        setProducts(res.data.data)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const debounceSearch = useDebounce((value: string)=>{
        fetchProducts(value)
    },500)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        debounceSearch(value)
    }

    const handleSelect = (productId: string) => {
        form.setValue("product_id", productId)
        setIsOpen(false)
    }

    const handleClear = () => {
        form.setValue("product_id", '')
        setSearchTerm('')
        fetchProducts()
    }

    return (
        <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                    <FormLabel>Product</FormLabel>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                                    {field.value ? (
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={products.find((product) => product.id === field.value)?.images[0]?.url ?? '/placeholder.png'}
                                                alt={products.find((product) => product.id === field.value)?.name ?? 'Product Image'}
                                                width={40}
                                                height={40}
                                                className="rounded"
                                            />
                                            <span>
                                                {products.find((product) => product.id === field.value)?.name}
                                            </span>
                                        </div>
                                    ) : (
                                        "Select product"
                                    )}
                                    {field.value ? (
                                        <X
                                            className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClear()
                                            }}
                                        />
                                    ) : (
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    )}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <div className="flex flex-col space-y-2 p-2">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                        placeholder="Search Product..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                                <ScrollArea className="h-[200px]">
                                    {products.length === 0 ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">No product found.</div>
                                    ) : (
                                        products.map((product) => (
                                            <Button
                                                key={product.id}
                                                variant="ghost"
                                                onClick={() => handleSelect(product.id)}
                                                className="w-full justify-start"
                                            >
                                                <div className="flex items-center space-x-2 w-full">
                                                    <Image
                                                        src={product.images[0]?.url ?? '/placeholder.png'}
                                                        alt={product.name ?? 'Product Image'}
                                                        width={40}
                                                        height={40}
                                                        className="rounded"
                                                    />
                                                    <span>{product.name}</span>
                                                </div>
                                            </Button>
                                        ))
                                    )}
                                </ScrollArea>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

