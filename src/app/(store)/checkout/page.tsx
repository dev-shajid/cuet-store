'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useShoppingCart } from '@/hooks/use-shopping-cart'
import BlurImage from '@/components/BlurImage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Address, User } from '@prisma/client'
import { createOrder, getAuthUser } from '@/lib/action'
import { CheckoutSchema } from '@/lib/schema'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { useRouter } from 'next/navigation'
import { OrderAddress } from '@/types/type'
import { formatCurrency } from '@/lib/utils'
import { DEFAUTL_AUTH_REDIRECT } from '@/routes'




export default function CheckoutPage() {
    const [selectedAddress, setSelectedAddress] = useState<OrderAddress>({ full_address: '', save: false, new: false })
    const [authUser, setAuthUser] = useState<User & { addresses: Address[] } | undefined>(undefined)
    const [activeTab, setActiveTab] = useState<string>("existing")
    const [openDialog, setOpenDialog] = useState(false)

    const { toast } = useToast()
    const { onClose, onOpen } = useLoadingOverlay(state => state)
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {cartItems:orderItems, clearCart} = useShoppingCart(state => state)
    const total = orderItems.reduce((acc, product) => acc + (product.price * product.quantity), 0)

    const form = useForm<z.infer<typeof CheckoutSchema>>({
        resolver: zodResolver(CheckoutSchema),
        defaultValues: {
            phone: '',
            address: {
                full_address: '',
                save: false,
                new: false,
            },
        },
    })

    async function handleOrderSubmit(values: z.infer<typeof CheckoutSchema>) {
        // onOpen()
        alert(JSON.stringify({ ...values, orderItems }))
        try {
            onOpen()
            setIsLoading(true)

            let res = await createOrder({ ...values, orderItems })

            console.log(res)

            toast({
                title: res.success ? '✅ Success' : '❌ Error',
                description: res.message
            })
            if (res.success) {
                clearCart()
                router.push(`${DEFAUTL_AUTH_REDIRECT}`)
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



    const fetchUser = async () => {
        const res = await getAuthUser([], { addresses: true })
        if (res.success) {
            setAuthUser(res.data)

        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <div className="flex container items-center justify-center p-4 h-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOrderSubmit)} className="w-full grid gap-6 lg:grid-cols-2  items-start">
                    <Card>
                        <CardHeader>
                            <h4 className="text-lg font-semibold">Customer Information</h4>
                            <CardDescription>Please fill in your details</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    readOnly
                                    value={authUser?.name ?? ''}
                                    placeholder="John Doe"
                                    type="text"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    readOnly
                                    value={authUser?.email ?? ''}
                                    placeholder="john.doe@example.com"
                                    type="email"
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter your phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.full_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                                <DialogTrigger asChild>
                                                    <div>
                                                        <Input
                                                            id="address"
                                                            placeholder="Select an address"
                                                            readOnly
                                                            value={field.value || ""}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Select an Address</DialogTitle>
                                                        <DialogDescription>
                                                            Choose an existing address or add a new one
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <Tabs defaultValue="existing" onValueChange={setActiveTab}>
                                                        <TabsList className="grid w-full grid-cols-2">
                                                            <TabsTrigger value="existing">Existing</TabsTrigger>
                                                            <TabsTrigger value="new">New</TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="existing">
                                                            <RadioGroup
                                                                className="space-y-2"
                                                                value={form.watch("address.full_address")}
                                                                onValueChange={(value) => {
                                                                    const address = authUser?.addresses.find(addr => addr.full_address === value);
                                                                    if (address) {
                                                                        form.setValue("address.full_address", address.full_address);
                                                                        form.setValue("address.new", false);
                                                                        form.setValue("address.save", false);
                                                                    }
                                                                }}
                                                            >
                                                                {authUser?.addresses.length ? (
                                                                    authUser?.addresses.map((addr) => (
                                                                        <Label
                                                                            htmlFor={addr.id}
                                                                            key={addr.id}
                                                                            className="flex items-center space-x-2 flex-row p-3 border rounded-md cursor-pointer"
                                                                        >
                                                                            <RadioGroupItem
                                                                                value={addr.full_address}
                                                                                id={addr.id}
                                                                            />
                                                                            <div>{addr.full_address}</div>
                                                                        </Label>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-muted-foreground text-center">
                                                                        No addresses found
                                                                    </p>
                                                                )}
                                                            </RadioGroup>
                                                        </TabsContent>
                                                        <TabsContent value="new">
                                                            <div className="space-y-4">
                                                                <Input
                                                                    placeholder="Enter a new address"
                                                                    value={form.watch("address.full_address")}
                                                                    onChange={(e) =>
                                                                        form.setValue("address.full_address", e.target.value)
                                                                    }
                                                                />
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id="saveAddress"
                                                                        checked={form.watch("address.save")}
                                                                        onCheckedChange={(checked) => {
                                                                            form.setValue("address.new", true)
                                                                            form.setValue("address.save", checked as boolean)
                                                                        }}
                                                                    />
                                                                    <Label htmlFor="saveAddress">
                                                                        Save to my addresses
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                </DialogContent>
                                            </Dialog>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                    </Card>

                    {/* Checkout::::: Order Details */}
                    <Card>
                        <CardHeader>
                            <h4>Order Summary</h4>
                            <CardDescription>Review your items</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {orderItems.map((product) => (
                                <div key={product.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground">
                                            <BlurImage
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                                        </div>
                                    </div>
                                    <p>{formatCurrency(product.price * product.quantity)}</p>
                                </div>
                            ))}
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between font-semibold">
                                    <p className='text-muted-foreground'>Total</p>
                                    <p>{formatCurrency(total)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4">
                            <Button
                                type='submit'
                                className="w-full h-7 font-medium"
                            >
                                Confirm Order
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}