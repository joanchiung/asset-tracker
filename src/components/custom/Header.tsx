'use client'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserRound, LogOut } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const token = session?.accessToken

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await fetchFunc({
        key: 'Logout',
        headers: { Authorization: `Bearer ${token}` }
      })
    },
    onSuccess: () => {
      signOut({ redirect: true, callbackUrl: '/login' })
      toast.success('登出成功')
    },
    onError: (error) => {
      console.error('自定義登出 API 失敗:', error)
      signOut({ redirect: true, callbackUrl: '/login' })
      toast.error('登出失敗', { description: error.message || '請稍後再試' })
    }
  })

  return (
    <div className="w-full flex flex-row p-4   justify-between">
      <div>
        <h1 className="text-2xl font-bold">Asset Tracker</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <UserRound />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <Link href="/user-portfolio">
              <DropdownMenuItem>帳戶設定</DropdownMenuItem>
            </Link>

            <Link href="/asset-list">
              <DropdownMenuItem>資產列表</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
            {logoutMutation.isPending ? '登出中...' : '登出'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
