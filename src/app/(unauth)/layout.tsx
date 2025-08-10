'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function UnauthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session) {
      router.replace('/user-portfolio')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">檢查登入狀態中...</div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null
  }

  return <>{children}</>
}
