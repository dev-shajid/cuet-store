'use client'

import React from 'react'
import { useState } from "react"
import PageTransitionLayout from '../PageTransitionLayout'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import DashboardSidebar from '../DashboardSidebar'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { SessionProvider } from 'next-auth/react'
import useMounted from '@/hooks/use-mounted'
import UserMenu from '../UserMenu'

interface NavComponentProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState<boolean>(false)
    const mutate = useMounted()

    if (!mutate) return null;
    return (
        <SessionProvider>
            <div className="grid w-full max-w-[100dvw] h-dvh lg:grid-cols-[250px_1fr] overflow-hidden backdrop-blur-md bg-background/70">
                <div className="hidden border-r lg:block h-dvh bg-background/50 backdrop-blur-md">
                    <DashboardSidebar open={open} setOpen={setOpen} />
                </div>
                <main className='flex-1 overflow-y-auto grid grid-rows-[60px_1fr]'>
                    <DashboardNavbar open={open} setOpen={setOpen} />
                    <PageTransitionLayout>
                        <div className="container p-4">
                            {children}
                        </div>
                    </PageTransitionLayout>
                </main>
            </div>
        </SessionProvider>
    )
}

function DashboardNavbar({ open, setOpen }: NavComponentProps) {
    return (
        <section className="sticky top-0 z-10 bg-background/50 backdrop-blur-lg border-b flex justify-center items-center">
            <header className="flex items-center justify-between w-full gap-4 px-4 container">
                <DashboardSidebarMobile open={open} setOpen={setOpen} />

                <nav className="ml-auto gap-4 sm:gap-6 items-center flex">
                    <UserMenu />
                </nav>
            </header>
        </section>
    )
}

const DashboardSidebarMobile = ({ open, setOpen }: NavComponentProps) => {
    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 lg:hidden rounded-full"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-2 !max-w-[280px]">
                    <SheetHeader>
                        <SheetTitle className='hidden'></SheetTitle>
                    </SheetHeader>
                    <DashboardSidebar open={open} setOpen={setOpen} />
                </SheetContent>
            </Sheet>
        </header>
    )
}
