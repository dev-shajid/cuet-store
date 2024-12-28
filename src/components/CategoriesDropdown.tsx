'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from 'lucide-react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DataTableQueryProps, TableDataType } from "@/types/type"
import { getCategories } from "@/lib/action"
import { Category } from "@prisma/client"
import { ApiResponseType } from "@/lib/ApiResponse"

export default function CategoriesDropdown() {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchCategories() {
            const query: DataTableQueryProps = { featured: true, limit: 100, onlyPublished: true }
            const res: ApiResponseType<TableDataType<Category>> = await getCategories(query)
            if (res.success && res.data) setCategories(res?.data?.data);

            setLoading(false);
        }

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="ml-4 h-5 w-24 rounded-md bg-muted animate-pulse"></div>;
    }

    if (!categories) {
        return <div>Failed to load categories</div>;
    }

    return (
        <>
            <DesktopNavigation categories={categories} />
            <MobileNavigation categories={categories} />
        </>
    )
}

function DesktopNavigation({ categories }: { categories: Category[] }) {
    return (
        <div className="hidden md:block relative">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <Menu className="mr-2 h-4 w-4" />
                            Categories
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ScrollArea className="max-h-[300px] overflow-y-auto py-2">
                                <div className="px-4 pb-4 w-[300px]">
                                    {categories.map((category) => (
                                        <Link key={category.id} href={`/products?categories=${category.name}&limit=10&page=1`} className="flex">
                                            <div className="flex items-center gap-3 p-2 hover:bg-muted transition-all w-full rounded-md">
                                                <div className="relative size-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                    {category.image ? (
                                                        <Image
                                                            src={category.image}
                                                            alt={category.name}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <span className="text-sm font-medium text-center text-card-foreground">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </ScrollArea>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

function MobileNavigation({ categories }: { categories: Category[] }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    return (
        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Menu className="mr-2 h-4 w-4" />
                        Categories
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                    <SheetHeader className="px-6 py-4">
                        <SheetTitle>Categories</SheetTitle>
                    </SheetHeader>
                    <Separator />
                    <ScrollArea className="h-[calc(100vh-80px)] px-6 py-4">
                        {categories.map((category) => (
                            <div key={category.id} className="mb-6">
                                <Link href="#" className="flex items-center gap-4">
                                    <div className="relative w-12 h-12">
                                        <div className="relative w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{category.name}</span>
                                </Link>
                            </div>
                        ))}
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    )
}

