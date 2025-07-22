'use client'
import React from 'react'

/* tanstack */
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'

/* next-auth */
import { signOut, useSession } from 'next-auth/react'

/* component */
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Calendar,
  Shield,
  Phone,
  Clock,
  Key,
  LogOut,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function UserPortfolio() {
  const { data: session, status } = useSession()

  const token = session?.accessToken

  const initialUserInfo = {
    id: '',
    email: '',
    username: '',
    phone: '',
    createdAt: '',
    updatedAt: '',
    isActive: false,
    isVerified: false
  }

  const { data: userInfo = initialUserInfo, isLoading } = useQuery({
    queryKey: ['GetProfile'],
    queryFn: () =>
      fetchFunc({
        key: 'GetProfile',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    select: (data) => data.data?.user,
    enabled: !!token
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchFunc({
        key: 'Logout',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res
    },
    onSuccess: () => {
      signOut({
        redirect: true,
        callbackUrl: '/login'
      })

      toast('登出成功', {
        duration: 2000
      })
    },

    onError: (error: Error) => {
      console.error('自定義登出 API 失敗:', error)

      toast('登出失敗', {
        description: error.message || '登出失敗，請稍後再試',
        duration: 4000,
        action: {
          label: '重試',
          onClick: () => handleLogout()
        }
      })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  if (status === 'loading' || isLoading) {
    return <div>載入中...</div>
  }

  if (!token) {
    return <div>找不到認證 token，請重新登入</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* 歡迎標題 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold text-green-700">登入成功</h1>
        </div>
        <p className="text-gray-600">歡迎回來！以下是您的帳戶資訊</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用戶資訊卡片 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              用戶資訊
            </CardTitle>
            <CardDescription>您的個人帳戶詳細資料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">用戶名稱</span>
                </div>
                <span className="text-sm">{userInfo.username}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">電子郵件</span>
                </div>
                <span className="text-sm">{userInfo.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">電話號碼</span>
                </div>
                <span className="text-sm">{userInfo.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">用戶ID</span>
                </div>
                <span className="text-sm font-mono">{userInfo.id}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">註冊時間</span>
                </div>
                <span className="text-sm">{userInfo.createdAt}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">最後更新</span>
                </div>
                <span className="text-sm">{userInfo.updatedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 帳戶狀態卡片 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              帳戶狀態
            </CardTitle>
            <CardDescription>您的帳戶安全狀態</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">帳戶狀態</span>
                <Badge
                  variant={userInfo.isActive ? 'default' : 'secondary'}
                  className="flex items-center gap-1"
                >
                  {userInfo.isActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {userInfo.isActive ? '活躍' : '非活躍'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">驗證狀態</span>
                <Badge
                  variant={userInfo.isVerified ? 'default' : 'destructive'}
                  className="flex items-center gap-1"
                >
                  {userInfo.isVerified ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {userInfo.isVerified ? '已驗證' : '未驗證'}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Session 資訊</h4>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">用戶名稱</span>
                  <span className="text-xs">{session.user.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Session Email</span>
                  <span className="text-xs">{session.user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Access Token</span>
                  <Badge variant="outline" className="text-xs">
                    {session.accessToken ? '有效' : '無效'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Refresh Token</span>
                  <Badge variant="outline" className="text-xs">
                    {session.refreshToken ? '有效' : '無效'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          variant="destructive"
          size="lg"
          className="w-full max-w-md flex items-center gap-2"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? '登出中...' : '登出'}
        </Button>
      </div>
    </div>
  )
}
