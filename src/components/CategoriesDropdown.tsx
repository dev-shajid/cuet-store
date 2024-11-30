"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"

export default function CategoriesDropdown() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const categories = {
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

    const CategoryContent = ({ isMobile = false }) => (
        <div className={cn(
            'grid gap-6',
            isMobile ? 'grid-cols-1 p-0' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5 p-6 bg-transparent',
        )}>
            {Object.entries(categories).map(([category, items]) => (
                <div key={category} className="space-y-3">
                    <h6>{category}</h6>
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item} className="text-sm text-muted-foreground list-disc ml-4">
                                <Link href="#" className={cn(isMobile ? "" : "hover:underline")}>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
                                <Menu size={15} className="mr-1" />
                                Categories
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className=" bg-none">
                                <ScrollArea className="max-h-[85dvh] h-full overflow-auto max-w-screen-xl w-[80dvw] !bg-none backdrop-blur-md">
                                    <CategoryContent />
                                </ScrollArea>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant='ghost'>
                            <Menu size={15} className="mr-1" />
                            Categories
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                        <SheetHeader className="flex-row items-center justify-between px-6 py-3">
                            <SheetTitle>
                                Categories
                            </SheetTitle>
                            <SheetClose asChild>
                                <X size={15} className="text-muted-foreground cursor-pointer" />
                            </SheetClose>
                        </SheetHeader>
                        <Separator />
                        <ScrollArea className="h-[calc(100vh-60px)] px-6 pt-3 pb-2">
                            <CategoryContent isMobile={true} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}