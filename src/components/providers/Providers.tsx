'use client'

import TanstackProvider from './TanstackProvider'
import { SessionProvider } from 'next-auth/react'
import AuthWrapper from './AuthWrapper'

import { Toaster } from '@/components/ui/sonner'
export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <TanstackProvider>
        <AuthWrapper>{children}</AuthWrapper>
        <Toaster />
      </TanstackProvider>
    </SessionProvider>
  )
}
