'use client'

import React from 'react'
import { ThemeProvider } from '../theme/theme-provider'
import LoadingOverlayProvider from '@/providers/loading-overlay-provider'
import useMounted from '@/hooks/use-mounted'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '../ui/toaster'

export default function RootLayoutContainer({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()

  if (!mounted) return null;
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster />
        <LoadingOverlayProvider />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
