'use client'

import Link from "next/link"
import {
    BaggageClaimIcon,
    BookMarkedIcon,
    Home,
    Percent,
    User,
    Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"
import { cn } from "@/lib/utils"
import Logo from "./Logo"

interface NavComponentProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardSidebar({ setOpen }: NavComponentProps) {
    const pathname = usePathname()

    return (
        <>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link onClick={() => setOpen(false)} href="/dashboard">
                        <Logo/>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between px-1 gap-1 text-sm font-medium lg:px-4 pb-6">
                    <nav className="grid items-start gap-1 mt-2">
                        {
                            MenuItems.map((menu, i) => (
                                <Link
                                    onClick={() => setOpen(false)}
                                    key={i}
                                    href={menu.url}
                                    className={cn(
                                        "flex items-center gap-3 rounded-sm px-3 py-2 transition-all",
                                        pathname.split('/').slice(0, 3).join('/') == menu.url ? 'bg-blue-500/15 text-blue-500' : 'md:hover:bg-foreground/10'
                                    )}
                                >
                                    <menu.icon className='size-4' />
                                    {menu.label}
                                </Link>
                            ))
                        }
                    </nav>
                </div>
            </div>
        </>
    )
}


const MenuItems = [
    {
        label: 'Home',
        url: '/dashboard',
        icon: Home,
    },
    {
        label: 'Slides',
        url: '/dashboard/slides',
        icon: BookMarkedIcon,
    },
    {
        label: 'Categories',
        url: '/dashboard/categories',
        icon: BookMarkedIcon,
    },
    {
        label: 'My Products',
        url: '/dashboard/products',
        icon: BookMarkedIcon,
    },
    {
        label: 'Selling Orders',
        url: '/dashboard/selling-orders',
        icon: BaggageClaimIcon,
    },
    {
        label: 'Buying Orders',
        url: '/dashboard/buying-orders',
        icon: BaggageClaimIcon,
    },
    {
        label: 'Customers',
        url: '/dashboard/customers',
        icon: Users,
    },
    {
        label: 'Reviews',
        url: '/dashboard/reviews',
        icon: Percent,
    },
    {
        label: 'Profile',
        url: '/dashboard/profile',
        icon: User,
    },
]