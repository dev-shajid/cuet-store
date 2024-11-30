'use client'

import React from 'react'
import { useEffect, useState } from "react"
import PageTransitionLayout from '../PageTransitionLayout'
import { BookOpen, User } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ThemeToggle from "@/components/theme/them-change"
import { UserMenu } from './Layout'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const [mutate, setMutate] = useState(false)

    useEffect(() => {
        setMutate(true)
    }, [])

    if (!mutate) return null;
    return (
        <main className='grid grid-rows-[auto_1fr] min-h-svh'>
            <header className="sticky top-0 z-10 bg-background/50 backdrop-blur-md py-2">
                <div className="flex items-center justify-between w-full gap-4 px-4 container">
                    <Link className="flex items-center justify-center" href="/">
                        <BookOpen className="h-6 w-6" />
                        <span className="ml-2 font-bold text-xl">C-STORE</span>
                    </Link>

                    <nav className="ml-auto gap-4 sm:gap-6 items-center flex">
                        <UserMenu />
                    </nav>
                </div>
            </header>
            <PageTransitionLayout>
                {children}
            </PageTransitionLayout>
        </main>
    )
}
