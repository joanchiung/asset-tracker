'use client'

import TanstackProvider from './TanstackProvider'
import { SessionProvider } from 'next-auth/react'

import { Toaster } from '@/components/ui/sonner'
export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <TanstackProvider>
        {children}
        <Toaster />
      </TanstackProvider>
    </SessionProvider>
  )
}
