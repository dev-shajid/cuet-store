'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Loader2,
  Search,
  ShoppingBag,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import CategoriesDropdown from "../CategoriesDropdown"
import PageTransitionLayout from "../PageTransitionLayout"
import { DataTableQueryProps, Product, ProductType, TableDataType } from "@/types/type"
import { useShoppingCart } from "@/hooks/use-shopping-cart"
import { useSession } from "next-auth/react"
import UserMenu from "../UserMenu"
import Logo from "../Logo"
import { ApiResponseType } from "@/lib/ApiResponse"
import { toast } from "@/hooks/use-toast"
import { getProducts } from "@/lib/action"
import { ScrollArea } from "../ui/scroll-area"
import useDebounce from "@/hooks/use-debounce"
import { formatCurrency } from "@/lib/utils"
import BlurImage from "../BlurImage"

export default function Component({ children }: React.PropsWithChildren) {
  const [mutate, setMutate] = useState(false)
  const { status, data } = useSession()

  // console.log({ status, data })

  useEffect(() => {
    setMutate(true)
  }, [])

  if (!mutate) return null;

  return (
    <div className="w-full min-h-screen grid grid-rows-[auto_1fr]">
      <NavComponent />
      <PageTransitionLayout>
        <main className="pb-8 h-full">{children}</main>
      </PageTransitionLayout>
    </div>
  )
}

const NavComponent = () => {
  return (
    <section className="sticky top-0 left-0 right-0 z-10 bg-background/70 backdrop-blur-md w-full">
      <header className="flex items-center justify-between w-full gap-4 px-4 py-2 container">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <CategoriesDropdown />
          <Link href="/products?limit=10&page=1">Products</Link>
        </div>

        <nav className="ml-auto gap-4 sm:gap-6 items-center flex">
          <SearchComponent />
          <NavItems />
        </nav>
      </header>
    </section>
  )
}

const NavItems = () => {
  const totalItems = useShoppingCart(state => state.cartItems.length)
  return (
    <>
      <Link href="/cart" className="relative p-2">
        <ShoppingBag size={24} />
        {
          totalItems ?
            <span className="absolute top-0 right-0 bg-muted-foreground text-background rounded-full px-1 text-xs font-semibold">
              {totalItems}
            </span> :
            null
        }
      </Link>
      <UserMenu />
    </>
  )
}

const SearchComponent = () => {
  const searchParams = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/products?search=${searchValue}&limit=20&page=1`)
    setDialogOpen(false)
  }

  const fetchProducts = async (value: string = '') => {
    try {
      setIsLoading(true)
      const query: DataTableQueryProps & { categories?: string[] } = {
        limit: Number(searchParams.get('limit') ?? 10),
        page: Number(searchParams.get('page') ?? 1),
        categories: searchParams.get('categories')?.split(','),
      }
      if (value) query.search = value

      const sort = searchParams.get('sort')
      if (sort) {
        query.sort_by = 'price'
        query.sort_order = (sort == 'price_asc' ? 'asc' : 'desc') as 'desc' | 'asc'
      }

      const res: ApiResponseType<TableDataType<Product>> = await getProducts(query)
      if (res.success && res.data) setSearchResults(res.data.data)
      else {
        toast({
          title: '❌ Error',
          description: res.message
        })
      }
      console.log(res.data)
    } catch (error) {
      toast({
        title: '❌ Error',
        description: error instanceof Error ? error?.message : 'Something went wrong'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const debounceFetchProducts = useDebounce((value: string = '') => {
    fetchProducts(value)
  }, 500)

  useEffect(() => {
    fetchProducts(searchParams.get('search')!)
  }, [searchParams])

  useEffect(() => {
    if (dialogOpen) {
      fetchProducts()
    }
  }, [dialogOpen])

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Search size={20} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="p-0 top-[20%] translate-y-0">
          <DialogHeader className="">
            <DialogTitle className="hidden">
            </DialogTitle>
            <div className="flex items-center relative px-4 py-1 border-b border-input">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-full relative"
              >
                <Input
                  type="text"
                  placeholder="Search for products"
                  className="border-none focus-visible:ring-0 px-0 py-0"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                    setIsLoading(true)
                    debounceFetchProducts(e.target.value)
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  className="size-auto"
                >
                  <Search size={16} className="text-muted-foreground" />
                </Button>
              </form>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[300px]">
            <DialogFooter className="px-4 pb-4">
              {/* <div> */}
              {isLoading ? (
                <Loader2 size={20} className="mx-auto text-muted-foreground animate-spin" />
              ) : !searchResults.length ? (
                <p className="text-muted-foreground text-center">No results found</p>
              ) : (
                <div className="w-full grid gap-2">
                  {
                    searchResults.map((product) => (
                      <Link
                        href={`/products/${product.id}`}
                        onClick={() => setDialogOpen(false)}
                        key={product.id}
                        className="py-2 transition border border-transparent hover:border hover:bg-muted rounded-md last:border-b-0 flex gap-3"
                      >
                        <div>
                          <BlurImage src={product.images[0].url} alt={product.name} className="size-16" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{product.name}</p>
                          <p className='text-muted-foreground text-xs'>{product.category_name}</p>
                          <p className="text-sm text-blue-500 font-semibold">{formatCurrency(product.price)}</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )}
              {/* </div> */}
            </DialogFooter>
          </ScrollArea>

        </DialogContent>
      </Dialog>
    </>
  )
}