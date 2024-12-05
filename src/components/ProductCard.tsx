import React from 'react'

import { Card, CardContent, CardFooter } from './ui/card'
import Link from 'next/link'
import { Product } from '@/types/type'
import BlurImage from './BlurImage'
import { formatCurrency } from '@/lib/utils'

interface ProductCardProps {
    product: Product
    index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    return (
        <Card key={product.id} className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
            <CardContent className="p-0 relative aspect-square overflow-hidden border-b">
                {
                    product.images.length > 0 ? (
                        <BlurImage
                            src={product.images[0].url}
                            alt={product.name}
                            id={index}
                            className='hover:scale-110'
                        />
                    ) : (
                        <div className="w-full h-full bg-muted"></div>
                    )
                }
            </CardContent>
            <CardFooter className="py-2 sm:px-4 px-3 bg-muted/40 flex-1">
                <div className="flex flex-col w-full space-y-[4px]">
                    <Link href={`/products/${product.id}`} className="block hover:text-primary transition-colors cursor-pointer">
                        {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                    </Link>
                    <span className='text-muted-foreground text-sm'>{product.category_name}</span>
                    <p className="text-base text-blue-500 font-semibold">{formatCurrency(product.price)}</p>
                </div>
            </CardFooter>
        </Card>
    )
}
