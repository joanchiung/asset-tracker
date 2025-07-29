// components/AuthWrapper.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const publicOnlyPaths = ['/login', '/signup', '/forget-pwd']
  const protectedPaths = ['/user-portfolio']

  useEffect(() => {
    if (status === 'loading') return // 還在載入中

    const isPublicOnlyPath = publicOnlyPaths.some((path) => pathname.startsWith(path))
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

    if (session && isPublicOnlyPath) {
      // 已登入用戶訪問登入頁面，重導向到 dashboard
      console.log('✅ 已登入用戶訪問登入頁，重導向到 /user-portfolio')
      router.replace('/user-portfolio')
    } else if (!session && isProtectedPath) {
      // 未登入用戶訪問受保護頁面，重導向到登入頁
      console.log('✅ 未登入用戶訪問受保護頁面，重導向到 /login')
      router.replace('/login')
    }
  }, [session, status, pathname, router])

  // 載入中狀態
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>載入中...</div>
      </div>
    )
  }

  return <>{children}</>
}
