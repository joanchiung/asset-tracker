import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import { updateUserSchema, UpdateUserFormData } from '@/lib/validations'
import { InfoItem } from './InfoItem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, Phone, Mail, Calendar, Clock, Edit2, Save, X } from 'lucide-react'
import { UserProfile } from '../page'

// 定義這個元件需要接收的 props
interface UserInfoCardProps {
  userInfo: UserProfile
  token: string
}

export const UserInfoCard = ({ userInfo, token }: UserInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: userInfo?.username || '',
      phone: userInfo?.phone || ''
    }
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
      toast.error('更新失敗', { description: error.message || '請稍後再試' })
    }
  })

  const onSubmit = (data: UpdateUserFormData) => {
    const updatedFields: Partial<UpdateUserFormData> = {}
    if (data.username && data.username !== userInfo.username) updatedFields.username = data.username
    if (data.phone && data.phone !== userInfo.phone) updatedFields.phone = data.phone

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
    reset({ username: userInfo?.username || '', phone: userInfo?.phone || '' })
    setIsEditing(false)
  }

  const userInfoItems = [
    {
      key: 'username',
      icon: <User />,
      label: '用戶名稱',
      value: userInfo.username,
      editable: true
    },
    { key: 'phone', icon: <Phone />, label: '電話號碼', value: userInfo.phone, editable: true },
    { key: 'email', icon: <Mail />, label: '電子郵件', value: userInfo.email, editable: false }
  ]

  const timestampItems = [
    { key: 'createdAt', icon: <Calendar />, label: '註冊時間', value: userInfo.createdAt },
    { key: 'updatedAt', icon: <Clock />, label: '最後更新', value: userInfo.updatedAt }
  ]

  return (
    <Card>
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
        </CardContent>
      </form>
    </Card>
  )
}
