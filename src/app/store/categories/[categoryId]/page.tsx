'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { categories, products } from '@/lib/data'
import NotFoundCard from '@/components/NotFoundCard'

export default function CategoryProducts({ params }: { params: Promise<{ categoryId: string }> }) {
    const [sortBy, setSortBy] = useState('featured')
    const [categoryId, setCategoryId] = useState<string | null>(null)

    useEffect(() => {
        params.then(resolvedParams => {
            setCategoryId(resolvedParams.categoryId)
        })
    }, [params])

    const category = categories.find(c => c.id.toString() === categoryId)
    const categoryProducts = products.filter(p => p.id == category?.id)

    if (!category) return <NotFoundCard />

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

            {
                categoryProducts.length === 0 ? null :
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-muted-foreground">{categoryProducts.length} products</p>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
            }

            {
                categoryProducts.length === 0 ?
                    <div className="flex items-center justify-center h-96">
                        <p className="text-muted-foreground">No products found in this category</p>
                    </div> : null
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {
                categoryProducts.length === 0 ? null :
                    <div className="mt-12 flex justify-center">
                        <Button variant="outline" className="mr-2">Previous</Button>
                        <Button variant="outline" className="mr-2">1</Button>
                        <Button variant="outline" className="mr-2">2</Button>
                        <Button variant="outline" className="mr-2">3</Button>
                        <Button variant="outline">Next</Button>
                    </div>
            }
        </div>
    )
}