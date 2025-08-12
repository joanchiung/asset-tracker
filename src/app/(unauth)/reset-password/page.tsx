'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

import { useMutation } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'

import { resetPasswordSchema } from '@/lib/validations'

import type { z } from 'zod'

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPWDrequest {
  token: string
  newPassword: string
  confirmNewPassword: string
}

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      form.setValue('token', tokenFromUrl, { shouldValidate: true })
    } else {
      toast.error('無效的重設連結', {
        description: '缺少 token，將返回上一頁'
      })
      setTimeout(() => {
        router.push('/forget-pwd')
      }, 2000)
    }
  }, [searchParams, router, form])

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPWDrequest) => fetchFunc({ key: 'ResetPWD', request: data }),
    onSuccess: () => {
      toast.success('密碼重設成功！', { description: '請使用新密碼登入' })
      setTimeout(() => router.push('/login'), 2000)
    },
    onError: (error: Error) => {
      toast.error('重設密碼失敗', {
        description: error.message || '請稍後再試或重新申請重設連結'
      })
    }
  })

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(data)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>重設密碼</CardTitle>
            <CardDescription>
              請輸入您的新密碼。密碼需至少8字元，並包含大小寫、數字及特殊符號。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新密碼</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="請輸入新密碼"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
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
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="請再次輸入新密碼"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? '重設中...' : '重設密碼'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/login')}
                  >
                    返回登入
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
