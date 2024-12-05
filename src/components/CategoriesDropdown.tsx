"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ChevronRight } from 'lucide-react'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const scrollbarHide = "scrollbar-hide";

const categories: { [key: string]: string[] } = {
    "Other Machinery & Parts": [
        "Metallic Processing Machinery",
        "Machinery for Food, Beverage & Cereal",
        "Laser Equipment",
        "Mould",
        "Textile Machinery & Parts",
        "Cutting & Fold-bend Machine",
        "Paper Machinery",
        "Rubber Machinery",
        "Chemical Equipment & Machinery",
        "Mixing Equipment",
        "Machinery for Garment, Shoes & Accessories",
        "Crushing & Culling Machine",
    ],
    "Plastic & Woodworking": [
        "Plastic Machinery",
        "Woodworking Machinery",
        "Blow Molding Machine",
        "Plastic Recycling Machine",
        "Injection Molding Machine",
    ],
    "Construction Machinery": [
        "Building Material Making Machinery",
        "Lifting Equipment",
        "Excavator",
        "Concrete Machinery",
        "Stone Processing Machinery",
    ],
    "Agriculture Machinery": [
        "Agriculture Machinery",
        "Livestock MachineryFeed",
        "Feed Processing Machinery",
        "Tiller",
        "Harvesting Machine",
    ],
    "Machine Tools": [
        "CNC Machine Tools",
        "Lathe",
        "Grinding Machine",
        "Drilling Machine",
        "Milling Machine",
    ],
}

export default function CategoriesDropdown() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [activeCategory, setActiveCategory] = React.useState<keyof typeof categories | null>(null)

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block relative">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="">
                                <Menu className="mr-2 h-4 w-4" />
                                Categories
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="flex">
                                    <ul className={`w-[200px] p-2 bg-background h-[300px] overflow-y-auto ${scrollbarHide}`}>
                                        {Object.keys(categories).map((category) => (
                                            <li key={category}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="#"
                                                        className="px-3 py-2 hover:bg-accent rounded-md text-sm flex items-center justify-between"
                                                        onMouseEnter={() => setActiveCategory(category)}
                                                        onFocus={() => setActiveCategory(category)}
                                                    >
                                                        {category}
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                    {activeCategory && (
                                        <div className={`w-[400px] p-4 bg-background border-l h-[300px] overflow-y-auto ${scrollbarHide}`}>
                                            <h3 className="font-bold text-lg mb-4">{activeCategory}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {categories[activeCategory].map((subCategory) => (
                                                    <Link
                                                        key={subCategory}
                                                        href="#"
                                                        className="text-sm text-muted-foreground hover:text-foreground"
                                                    >
                                                        {subCategory}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
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
                            {Object.entries(categories).map(([category, subCategories]) => (
                                <div key={category} className="mb-6">
                                    <h5 className="font-semibold mb-2">{category}</h5>
                                    <ul className="space-y-2">
                                        {subCategories.map((subCategory) => (
                                            <li key={subCategory}>
                                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                                    {subCategory}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

