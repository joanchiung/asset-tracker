'use client'
import React from 'react'
import { UserRound, LogOut } from 'lucide-react'
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
import { useLogout } from '@/hooks/useLogout'

export function Header() {
  const { logout, isLoggingOut } = useLogout()

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

          <DropdownMenuItem disabled={isLoggingOut} onClick={logout}>
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? '登出中...' : '登出'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
