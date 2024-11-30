'use client'

import { Trash2, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from '@/components/ui/separator'
import HeaderTitle from '@/components/HeaderTitle'
import { useShoppingCart } from '@/hooks/use-shopping-cart'
import { getProduct } from '@/lib/action'
import { CartItem, Product } from '@/types/type'
import { ApiResponseType } from '@/lib/ApiResponse'
import { useEffect, useState } from 'react'
import Loading from '@/app/loading'
import { LinkButton } from '@/components/ui/link-button'
import { formatCurrency } from '@/lib/utils'


interface CartItemsProps {
    items: CartItem[]
    onQuantityChange: (id: string, quantity: number) => void
    onRemove: (id: string) => void
}

interface CartSummaryProps {
    subtotal: number
    discount: number
}

function CartItems({ items, onQuantityChange, onRemove }: CartItemsProps) {
    return (
        <div>
            <Card>
                <CardContent className="p-0">
                    {items.map((item, i) => (
                        <div key={item.id}>
                            <div className="flex items-center gap-4 p-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md" />
                                <div className="flex flex-col md:flex-row md:gap-4 gap-2 items-start md:items-center flex-1">
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        {/* <p className="text-sm text-muted-foreground">Category: {item.category}</p> */}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="w-20">{formatCurrency(item.price * item.quantity)}</div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <Separator />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

function CartSummary({ subtotal, discount }: CartSummaryProps) {
    return (
        <div className="relative">
            <Card className='sticky top-[80px]'>
                <CardContent className='pt-4'>
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className='text-muted-foreground'>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className='text-muted-foreground'>Discount (discount%)</span>
                            <span>{formatCurrency(subtotal * (discount / 100))}</span>
                        </div>
                        <div className="flex items-center mt-4">
                            <Input placeholder="Discount code" className="flex-1 mr-2" />
                            <Button variant="outline">Apply</Button>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-4">
                            <span className='text-muted-foreground'>Total</span>
                            <span>{formatCurrency(subtotal - discount)}</span>
                        </div>
                        <LinkButton href='/store/checkout' className="w-full h-8">Checkout</LinkButton>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function Cart() {
    const [isLoading, setIsLoading] = useState(false)
    const { cartItems, addProductToCart, removeProductFromCart, updateProductQuantity } = useShoppingCart(state => state)

    const subtotal = cartItems.reduce((sum, item) => sum + item?.price * item.quantity, 0)
    const discount = 0

    const getCartProducts = async () => {
        try {
            setIsLoading(true)
            for (const item of cartItems) {
                const res: ApiResponseType<Product> = await getProduct(item.id)
                if (res.success && res.data) {
                    const product = res.data
                    const cartItem = {
                        id: product?.id,
                        name: product?.name,
                        category: product.category_name,
                        price: Number(product?.price),
                        image: product?.images[0]?.url ?? '',
                        quantity: item.quantity
                    }

                    addProductToCart(cartItem)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCartProducts()
    }, [])

    if (isLoading) return <Loading />

    return (
        <div className="container md:py-12 py-8 space-y-8">
            {
                cartItems.length ?
                    <>
                        <HeaderTitle>Cart ({cartItems.length})</HeaderTitle>
                        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                            <CartItems
                                items={cartItems}
                                onQuantityChange={updateProductQuantity}
                                onRemove={removeProductFromCart}
                            />

                            <CartSummary
                                subtotal={subtotal}
                                discount={discount}
                            />
                        </div>
                    </> :
                    <h6 className='text-muted-foreground text-center font-semibold'>No Product is Added to Cart</h6>
            }
        </div>
    )
}