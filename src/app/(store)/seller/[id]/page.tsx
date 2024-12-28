'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { getSellerDetails, getSellerProducts } from '@/lib/action'
import { DataTableQueryProps, Product, TableDataType } from '@/types/type'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import ProductCard from '@/components/ProductCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { User } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { FilterComponent } from '../../products/page'

export default function SellerProfile() {
    const router = useRouter()
    const { id } = useParams()
    const searchParams = useSearchParams()
    const [seller, setSeller] = useState<User | null>(null)
    const [products, setProducts] = useState<TableDataType<Product> | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || undefined)

    useEffect(() => {
        const fetchSellerDetails = async () => {
            try {
                const sellerDetails = await getSellerDetails(id)
                setSeller(sellerDetails.data)
            } catch (error) {
                toast({
                    title: '❌ Error',
                    description: error instanceof Error ? error?.message : 'Failed to fetch seller details'
                })
            }
        }

        const fetchSellerProducts = async () => {
            try {
                setIsLoading(true)

                const query: DataTableQueryProps & { categories?: string[], minPrice?: number, maxPrice?: number } = {
                    limit: Number(searchParams.get('limit') ?? 10),
                    page: Number(searchParams.get('page') ?? 1),
                    categories: searchParams.get('categories')?.split(','),
                    onlyPublished: true,
                }

                const searchValue = searchParams.get('search')
                if (searchValue) query.search = searchValue

                const sort = searchParams.get('sort')
                if (sort) {
                    query.sort_by = 'price'
                    query.sort_order = (sort == 'price_asc' ? 'asc' : 'desc') as 'desc' | 'asc'
                }

                const minPrice = searchParams.get('minPrice')
                if (minPrice) query.minPrice = Number(minPrice)

                const maxPrice = searchParams.get('maxPrice')
                if (maxPrice) query.maxPrice = Number(maxPrice)

                const sellerProducts = await getSellerProducts(id, query)
                setProducts(sellerProducts.data)
            } catch (error) {
                toast({
                    title: '❌ Error',
                    description: error instanceof Error ? error?.message : 'Failed to fetch seller products'
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchSellerDetails()
        fetchSellerProducts()
    }, [id, searchParams])

    if (isLoading) {
        return (
            <div className="container mx-auto space-y-8 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
                            <CardContent className="p-0 relative aspect-square overflow-hidden border-b">
                                <div className="w-full h-full bg-muted animate-pulse"></div>
                            </CardContent>
                            <CardFooter className="py-2 sm:px-4 px-3 bg-muted/40 flex-1">
                                <div className="flex flex-col w-full space-y-[4px]">
                                    <div className={`w-3/4 h-4 bg-muted animate-pulse delay-[${index + 10}] rounded`}></div>
                                    <div className={`w-1/2 h-3 bg-muted animate-pulse delay-[${index + 10}] rounded`}></div>
                                    <div className={`w-1/4 h-4 bg-muted animate-pulse delay-[${index + 10}] rounded`}></div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!seller) {
        return (
            <div className="container mt-12">
                <Alert>
                    <AlertTitle className='text-destructive font-semibold'>
                        😵‍💫 Error!
                    </AlertTitle>
                    <AlertDescription>
                        Seller not found, please try again later
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <div className='grid grid-cols-2 max-w-[120px]'>
                            <span className='text-muted-foreground'>Seller:</span>
                            <p className="text-base font-semibold">{seller.name}</p>
                        </div>
                        <div className='grid grid-cols-2 max-w-[120px]'>
                            <span className='text-muted-foreground'>Email:</span>
                            <a href={`mailto:${seller.email}`} className="text-blue-600 underline">{seller.email}</a>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <FilterComponent />
                    <Select value={sortBy} onValueChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString())
                        setSortBy(e)
                        if (e == 'default') params.delete('sortBy')
                        else params.set('sort', e)
                        router.push(`?${params.toString()}`)
                    }}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products?.data?.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <DataTablePagination
                hasNextPage={products?.hasNextPage}
                hasPreviousPage={products?.hasPreviousPage}
                nextPage={products?.nextPage}
                previousPage={products?.previousPage}
                totalPages={products?.totalPages}
                totalCounts={products?.totalCounts}
            />
        </div>
    )
}