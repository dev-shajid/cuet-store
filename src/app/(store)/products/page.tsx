'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, X, RotateCcw } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { categories, products } from '@/lib/data'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataTableQueryProps, Product, TableDataType } from '@/types/type'
import { getProducts } from '@/lib/action'
import { ApiResponseType } from '@/lib/ApiResponse'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useDebounce from '@/hooks/use-debounce'

export default function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || undefined)

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {searchParams.get('search') ?
            <div className='border border-input h-9 px-4 py-2 flex items-center gap-2 rounded-md text-sm text-muted-foreground'>
              {searchParams.get('search') ?? 'All Products'}
              <X
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('search')
                  router.push(`?${params.toString()}`)
                }}
                className="h-4 w-4 cursor-pointer hover:text-white"
              />
            </div> : null}
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

      <ProductsList />

    </div>
  )
}



export function FilterComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get('categories')?.split(',') || [])
  const [selectedRatings, setSelectedRatings] = useState<string[]>(searchParams.get('ratings')?.split(',') || [])
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'price_asc')

  const updateURL = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('search', search)
    else params.delete('search')

    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')

    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')

    if (selectedCategories.length) params.set('categories', selectedCategories.join(','))
    else params.delete('categories')

    router.push(`?${params.toString()}`)
  }

  const debouncePriceFilter = useDebounce((min?:number, max?:number) => {
    updateURL()
  }, 500)

  useEffect(() => {
    debouncePriceFilter()
  }, [search, minPrice, maxPrice, selectedCategories, sortBy])

  const handleResetFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setSelectedCategories([])
    setSelectedRatings([])
    setSortBy('price_asc')

    updateURL()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          Filter
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-background/50 backdrop-blur-md flex flex-col">
        <SheetHeader className="flex-row items-center justify-between px-6 py-3 border-b">
          <SheetTitle>
            Filter
          </SheetTitle>
          <div className='flex gap-4 items-center'>
            <RotateCcw size={15} className='text-muted-foreground cursor-pointer' onClick={handleResetFilters} />
            <SheetClose asChild>
              <X size={15} className="text-muted-foreground cursor-pointer" />
            </SheetClose>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="px-6 space-y-8">
            <div>
              <h6 className="font-semibold mb-2">Categories</h6>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={category.id.toString()}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => handleCategoryChange(category.name)}
                    />
                    <label htmlFor={category.id.toString()} className="ml-2 text-sm font-medium">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-2">Price Range</h6>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="w-full"
                  min={0}
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value)
                    // debouncePriceFilter(Number(e.target.value), Number(maxPrice))
                  }}
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-full"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value)
                    // debouncePriceFilter(Number(minPrice), Number(e.target.value))
                  }}
                />
              </div>
            </div>
            {/* <div>
              <h6 className="font-semibold mb-2">Rating</h6>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating.toString())}
                      onCheckedChange={() => handleRatingChange(rating.toString())}
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-2 text-sm font-medium">
                      {rating} {rating < 5 && 'Stars & Up'}
                    </label>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet >
  )
}

function ProductsList() {
  const searchParams = useSearchParams()
  const [filterdProducts, setFilteredProducts] = useState<TableDataType<Product> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const query: DataTableQueryProps & { categories?: string[], minPrice?:number,maxPrice?:number } = {
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

      const res: ApiResponseType<TableDataType<Product>> = await getProducts(query)
      if (res.success) setFilteredProducts(res.data)
      else {
        toast({
          title: '❌ Error',
          description: res.message
        })
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: error instanceof Error ? error?.message : 'Something went wrong'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  if (isLoading) return <>
    <div className="container mx-auto space-y-8 py-8">

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
            <CardContent className="p-0 relative aspect-square overflow-hidden border-b">
              <div className="w-full h-full bg-muted animate-pulse delay-[]"></div>
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

      <div className="flex justify-end">
        <div className="w-32 h-8 bg-muted animate-pulse delay-[] rounded"></div>
      </div>
    </div>
  </>

  if (!filterdProducts) return (
    <div className="container mt-12">
      <Alert>
        <AlertTitle className='text-destructive font-semibold'>
          😵‍💫 Error!
        </AlertTitle>
        <AlertDescription>
          Something went wrong, please try again later
        </AlertDescription>
      </Alert>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {
          filterdProducts?.data.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </div>

      <DataTablePagination
        hasNextPage={filterdProducts?.hasNextPage}
        hasPreviousPage={filterdProducts?.hasPreviousPage}
        nextPage={filterdProducts?.nextPage}
        previousPage={filterdProducts?.previousPage}
        totalPages={filterdProducts?.totalPages}
        totalCounts={filterdProducts?.totalCounts}
      />
    </>
  )
}