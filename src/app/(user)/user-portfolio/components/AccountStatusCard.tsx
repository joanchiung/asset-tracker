import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, XCircle } from 'lucide-react'
import { PasswordChangeDialog } from './PasswordChangeDialog'
import { UserProfile } from '../page'

interface AccountStatusCardProps {
  userInfo: UserProfile
}

export const AccountStatusCard = ({ userInfo }: AccountStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          帳戶狀態
        </CardTitle>
        <CardDescription>您的帳戶安全與 Session 狀態</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">密碼</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">＊＊＊＊＊＊＊＊</span>
            <PasswordChangeDialog />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
