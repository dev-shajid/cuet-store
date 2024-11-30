"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { DropdownMenuItem } from "../ui/dropdown-menu"

export default function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenuItem onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')} className={cn("w-full flex items-center gap-x-2 p-0", className)}>
      Theme
      <SunIcon className="size-[1rem] transition-all dark:hidden" />
      <MoonIcon className="size-[1rem] hidden transition-all dark:rotate-0 dark:block" />
    </DropdownMenuItem>
  )
}
