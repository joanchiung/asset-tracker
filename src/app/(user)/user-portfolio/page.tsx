'use client'
import React, { useState } from 'react'

/* tanstack */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'

/* next-auth */
import { signOut, useSession } from 'next-auth/react'

/* react-hook-form & Zod */
import { useForm, UseFormRegister, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/* components & icons */
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Calendar,
  Shield,
  Phone,
  Clock,
  LogOut,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  LucideProps
} from 'lucide-react'

// =================================================================
// 1. Zod Schema 定義
// =================================================================
const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: '用戶名稱長度需介於 3 到 20 字元之間' })
    .max(20, { message: '用戶名稱長度需介於 3 到 20 字元之間' })
    .or(z.literal(''))
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: '電話號碼必須是 10 位數字' })
    .or(z.literal(''))
    .optional()
})

// 從 Zod schema 推斷出 TypeScript 型別
type UpdateUserFormData = z.infer<typeof updateUserSchema>

// =================================================================
// 型別定義
// =================================================================
interface InfoItemData {
  key: keyof UpdateUserFormData | string
  icon: React.ComponentType<LucideProps>
  label: string
  value?: string | number
  editable?: boolean
  className?: string
}

interface InfoItemProps {
  item: InfoItemData
  isEditing?: boolean
  register: UseFormRegister<UpdateUserFormData>
}

// InfoItem 獨立組件 (無變更)
const InfoItem = ({ item, isEditing, register }: InfoItemProps) => {
  const IconComponent = item.icon
  if (isEditing && item.editable) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 text-gray-500" />
          <label htmlFor={item.key} className="text-sm font-medium">
            {item.label}
          </label>
        </div>
        <Input
          id={item.key}
          {...register(item.key as Path<UpdateUserFormData>)}
          placeholder={`輸入新的${item.label}`}
          className="h-8 w-48"
        />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <IconComponent className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      <span className={`text-sm ${item.className || ''}`}>{item.value || '-'}</span>
    </div>
  )
}

export default function UserPortfolio() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const token = session?.accessToken

  // =================================================================
  // 2. 整合 Zod Resolver 到 useForm
  // =================================================================
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: '',
      phone: ''
    }
  })

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
        headers: { Authorization: `Bearer ${token}` }
      }),
    select: (data) => data.data?.user,
    enabled: !!token
  })

  const updateUserMutation = useMutation({
    mutationFn: (updatedData: UpdateUserFormData) =>
      fetchFunc({
        key: 'UpdateProfile',
        request: updatedData,
        headers: { Authorization: `Bearer ${token}` }
      }),
    onSuccess: () => {
      toast.success('用戶資料更新成功！')
      queryClient.invalidateQueries({ queryKey: ['GetProfile'] })
      setIsEditing(false)
    },
    onError: (error: Error) => {
      toast.error('更新失敗', {
        description: error.message || '請稍後再試'
      })
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await fetchFunc({
        key: 'Logout',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    onSuccess: () => {
      signOut({ redirect: true, callbackUrl: '/login' })
      toast.success('登出成功')
    },
    onError: (error) => {
      console.error('自定義登出 API 失敗:', error)
      toast.error('登出失敗', {
        description: error.message || '請稍後再試'
      })
    }
  })

  // =================================================================
  // 3. 簡化後的 onSubmit 函式
  // =================================================================
  const onSubmit = (data: UpdateUserFormData) => {
    const updatedFields: Partial<UpdateUserFormData> = {}

    if (data.username && data.username !== userInfo.username) {
      updatedFields.username = data.username
    }
    if (data.phone && data.phone !== userInfo.phone) {
      updatedFields.phone = data.phone
    }

    if (Object.keys(updatedFields).length > 0) {
      updateUserMutation.mutate(updatedFields)
    } else {
      toast.info('資料未變更')
      setIsEditing(false)
    }
  }

  const handleEdit = () => {
    setValue('username', userInfo?.username || '')
    setValue('phone', userInfo?.phone || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    reset({
      username: userInfo?.username || '',
      phone: userInfo?.phone || ''
    })
    setIsEditing(false)
  }

  const userInfoItems: InfoItemData[] = [
    { key: 'username', icon: User, label: '用戶名稱', value: userInfo.username, editable: true },
    { key: 'phone', icon: Phone, label: '電話號碼', value: userInfo.phone, editable: true },
    { key: 'email', icon: Mail, label: '電子郵件', value: userInfo.email, editable: false }
  ]

  const timestampItems: InfoItemData[] = [
    { key: 'createdAt', icon: Calendar, label: '註冊時間', value: userInfo.createdAt },
    { key: 'updatedAt', icon: Clock, label: '最後更新', value: userInfo.updatedAt }
  ]

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
        <Card className="col-span-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    用戶資訊
                  </CardTitle>
                  <CardDescription>您的個人帳戶詳細資料</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={handleEdit} type="button">
                    <Edit2 className="h-4 w-4 mr-2" />
                    編輯
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" type="submit" disabled={updateUserMutation.isPending}>
                      <Save className="h-4 w-4 mr-1" />
                      {updateUserMutation.isPending ? '儲存中...' : '儲存'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel} type="button">
                      <X className="h-4 w-4 mr-1" />
                      取消
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-5">
              <div className="space-y-4">
                {/* ================================================================= */}
                {/* 4. 渲染表單與錯誤訊息 */}
                {/* ================================================================= */}
                {userInfoItems.map((item) => (
                  <div key={item.key}>
                    <InfoItem item={item} isEditing={isEditing} register={register} />
                    {isEditing && item.editable && errors[item.key as keyof UpdateUserFormData] && (
                      <p className="text-xs text-right text-red-500 mt-1 pr-1">
                        {errors[item.key as keyof UpdateUserFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
                <Separator className="my-4" />
                {timestampItems.map((item) => (
                  <InfoItem key={item.key} item={item} isEditing={false} register={register} />
                ))}
              </div>
            </CardContent>
          </form>
        </Card>
        {/* 帳戶狀態 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              帳戶狀態
            </CardTitle>
            <CardDescription>您的帳戶安全與 Session 狀態</CardDescription>
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
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 登出按鈕 */}
      <div className="flex justify-center pt-4">
        <Button
          variant="destructive"
          size="lg"
          className="w-full max-w-md flex items-center gap-2"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? '登出中...' : '登出'}
        </Button>
      </div>
    </div>
  )
}
