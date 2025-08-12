'use client'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import { useSession } from 'next-auth/react'
interface ChangePWDRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: '請輸入目前密碼' }),
    newPassword: z
      .string()
      .min(8, { message: '新密碼長度至少需要 8 個字元' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: '新密碼需包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊符號'
      }),
    confirmNewPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: '新密碼與確認密碼不相符',
    path: ['confirmNewPassword'] // 在確認密碼欄位顯示錯誤
  })

export function PasswordChangeDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { data: session } = useSession()
  const token = session?.accessToken

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: ChangePWDRequest) =>
      fetchFunc({
        key: 'ChangePWD',
        request: passwordData,
        headers: { Authorization: `Bearer ${token}` }
      }),
    onSuccess: () => {
      toast.success('密碼更新成功！')
      setIsOpen(false)
      form.reset()
    },
    onError: (error: Error) => {
      toast.error('密碼更新失敗', {
        description: error.message || '請檢查您目前的密碼是否正確，或稍後再試'
      })
    }
  })

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    changePasswordMutation.mutate(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          更改密碼
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>更改密碼</DialogTitle>
          <DialogDescription>
            新密碼長度至少需要 8 個字元，且需包含大小寫字母、數字及特殊符號。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目前密碼</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="請輸入您現在的密碼" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密碼</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="請輸入您的新密碼" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>確認新密碼</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="請再次輸入您的新密碼" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? '儲存中...' : '儲存變更'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
