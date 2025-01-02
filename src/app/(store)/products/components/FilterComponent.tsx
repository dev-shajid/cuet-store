'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import useDebounce from '@/hooks/use-debounce'

export function FilterComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const selectedCategories = searchParams.get('categories')?.split(',') || []

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

  const debouncePriceFilter = useDebounce(() => {
    updateURL()
  }, 500)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium tracking-wide text-foreground">
                Price Range
              </h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value)
                    debouncePriceFilter()
                  }}
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value)
                    debouncePriceFilter()
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
