'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, CheckCircle } from 'lucide-react'
import { UserInfoCard } from './components/UserInfoCard'
import { AccountStatusCard } from './components/AccountStatusCard'
import { useLogout } from '@/hooks/useLogout'

export interface UserProfile {
  email: string
  username: string
  phone: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  isVerified: boolean
}

const initialUserInfo = {
  email: '',
  username: '',
  phone: '',
  createdAt: '',
  updatedAt: '',
  isActive: false,
  isVerified: false
}

export default function UserPortfolio() {
  const { data: session, status } = useSession()
  const token = session?.accessToken

  const { data: userInfo = initialUserInfo, isLoading } = useQuery({
    queryKey: ['GetProfile'],
    queryFn: () =>
      fetchFunc({
        key: 'GetProfile',
        headers: { Authorization: `Bearer ${token}` }
      }),
    select: (data) => data.data?.user,
    enabled: !!token
  })

  const { logout, isLoggingOut } = useLogout()

  if (status === 'loading' || isLoading) return <div>載入中...</div>
  if (!token) return <div>找不到認證 token，請重新登入</div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold text-green-700">登入成功</h1>
        </div>
        <p className="text-gray-600">歡迎回來！以下是您的帳戶資訊</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserInfoCard userInfo={userInfo} token={token} />
        <AccountStatusCard userInfo={userInfo} />
      </div>

      <div className="flex justify-center pt-4">
        <Button
          variant="destructive"
          size="lg"
          className="w-full max-w-md flex items-center gap-2"
          disabled={isLoggingOut}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? '登出中...' : '登出'}
        </Button>
      </div>
    </div>
  )
}
