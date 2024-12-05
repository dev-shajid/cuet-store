import HeaderTitle from '@/components/HeaderTitle'
import ProductCard from '@/components/ProductCard'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import BannerSlides from '@/components/BannerSlides'
import { Suspense } from 'react'
import { getCategories, getProducts } from '@/lib/action'
import { DataTableQueryProps, Product, TableDataType } from '@/types/type'
import { Category } from '@prisma/client'
import { ApiResponseType } from '@/lib/ApiResponse'
import wait from '@/lib/utils'




export default function StorePage() {
  return (
    <div className="space-y-6">
      <BannerSlides />

      <div className="container space-y-6">
        <Card className='w-full border-none bg-transparent'>
          <CardHeader>
            <HeaderTitle>Categories</HeaderTitle>
          </CardHeader>
          <Suspense fallback={<FallbackFeaturedCategories />} >
            <CardContent className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <FeaturedCategories />
            </CardContent>
          </Suspense>
        </Card>

        <Card className='bg-transparent border-none w-full'>
          <CardHeader>
            <HeaderTitle url='/products'>Featured Products</HeaderTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<FallbackFeaturedProducts />} >
              <FeaturedProducts />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function FeaturedCategories() {
  await wait(3000)
  const query: DataTableQueryProps = { featured: true, limit: 100, onlyPublished: true }
  const res: ApiResponseType<TableDataType<Category>> = await getCategories(query)
  const categories = res.data?.data

  if (!res.success) return null;
  return (
    <>
      {categories?.map((category) => (
        <Link key={category.id} href="#" className="block">
          <Card className="relative overflow-hidden">
            <div className="p-4 flex flex-col items-center gap-3">
              <div className="relative w-16 h-16">
                <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {
                    category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : null
                  }
                </div>
              </div>
              <span className="text-sm font-medium text-center text-card-foreground">
                {category.name}
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </>
  )
}

async function FeaturedProducts() {
  await wait(3000)
  const query: DataTableQueryProps = { featured: true, limit: 50, onlyPublished: true }
  const res: ApiResponseType<TableDataType<Product>> = await getProducts(query)
  const products = res.data?.data

  if (!res.success) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products?.map((product, index) => product.is_featured && (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}

function FallbackFeaturedCategories() {
  return (
    <CardContent className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="block">
          <Card className="relative overflow-hidden">
            <div className={`p-4 flex flex-col items-center gap-3 animate-pulse delay-[${index + 50}]`}>
              <div className="relative w-16 h-16">
                <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                </div>
              </div>
              <span className="text-sm font-medium text-center text-card-foreground bg-muted rounded h-4 w-3/4"></span>
            </div>
          </Card>
        </div>
      ))}
    </CardContent>
  )
}

function FallbackFeaturedProducts() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="block">
          <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardContent className={`p-0 relative bg-muted/0 aspect-square overflow-hidden border-b animate-pulse delay-[${index + 100}]`}>
              <div className="w-full h-full bg-muted"></div>
            </CardContent>
            <CardFooter className={`grid py-2 sm:px-4 px-3 bg-muted/40 animate-pulse delay-[${index + 100}]`}>
              <div className="block h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}