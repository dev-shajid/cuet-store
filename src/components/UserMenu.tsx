import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import ThemeToggle from './theme/them-change'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'


export default function UserMenu() {
    const { status } = useSession()
    const dashboardPath = usePathname().split('/')?.[1] === 'dashboard';
    console.log({ dashboardPath })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
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
                                    {
                                        dashboardPath ?
                                            <Link href='/'>
                                                Store
                                            </Link> :
                                            <Link href='/dashboard'>
                                                Dashboard
                                            </Link>
                                    }
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>
                                    Sign Out
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                <Logout />
                            </DropdownMenuItem> */}
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