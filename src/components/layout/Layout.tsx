'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Loader2,
  Search,
  ShoppingBag,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ThemeToggle from "@/components/theme/them-change"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import CategoriesDropdown from "../CategoriesDropdown"
import PageTransitionLayout from "../PageTransitionLayout"
import { ProductType } from "@/types/type"
import { useShoppingCart } from "@/hooks/use-shopping-cart"
import { signOut, useSession } from "next-auth/react"

export default function Component({ children }: React.PropsWithChildren) {
  const [mutate, setMutate] = useState(false)

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
        <Link className="flex flex-col items-center justify-center bg-foreground text-background rounded-full size-12 font-medium" href="/store">
          <span>C-B</span>
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
      <Link href="/store/cart" className="relative p-2">
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

export const UserMenu = () => {
  const { status } = useSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          status == 'loading' ?
            <div className="h-5 w-full rounded-sm bg-muted animate-pulse" /> :
            status == 'authenticated' ?
              <>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard'>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div
                    onClick={() => {
                      signOut()
                    }}
                  >Sign Out</div>
                </DropdownMenuItem>
              </> :
              <DropdownMenuItem asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </DropdownMenuItem>
        }
        <DropdownMenuItem asChild>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    router.push(`/store/products?search=${searchValue}&limit=20&page=1`)
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