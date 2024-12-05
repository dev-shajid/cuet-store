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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import CategoriesDropdown from "../CategoriesDropdown"
import PageTransitionLayout from "../PageTransitionLayout"
import { ProductType } from "@/types/type"
import { useShoppingCart } from "@/hooks/use-shopping-cart"
import { useSession } from "next-auth/react"
import UserMenu from "../UserMenu"
import Logo from "../Logo"

export default function Component({ children }: React.PropsWithChildren) {
  const [mutate, setMutate] = useState(false)
  const { status, data } = useSession()

  console.log({ status, data })

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

        <CategoriesDropdown />

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
  const [searchResults,] = useState<ProductType[]>([])
  const [isLoading,] = useState(false)

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/products?search=${searchValue}&limit=20&page=1`)
    setDialogOpen(false)
  }

  const router = useRouter()

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Search size={20} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="top-[20%] p-0">
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
                  onChange={(e) => setSearchValue(e.target.value)}
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

          {searchValue ?
            <div className="px-4 pb-4">
              {
                isLoading ?
                  <Loader2 size={20} className="mx-auto text-muted-foreground animate-spin" /> :
                  !searchResults.length ?
                    <p className="text-muted-foreground text-center">No results found</p> :
                    searchResults.map((product, index) => (
                      <div key={index}>

                      </div>
                    ))
              }
            </div> :
            null
          }

        </DialogContent>
      </Dialog>
    </>
  )
}