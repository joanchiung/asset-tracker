'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { Email } from '@/constant/api/auth/request-response.types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgetPasswordSchema } from '@/lib/validations'
import type { z } from 'zod'

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>

export default function ForgetPassword() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema)
  })

  const forgetPasswordMutation = useMutation({
    mutationFn: (data: Email) =>
      fetchFunc({
        key: 'ForgetPWD',
        request: data
      }),
    onSuccess: (response) => {
      toast.success('郵件已發送！', {
        description: response.message || '請檢查您的信箱並點擊重設連結'
      })
      setTimeout(() => {
        router.push('/login')
      }, 2500)

      reset()
    },
    onError: (error: Error) => {
      toast.error('發送失敗', {
        description: error.message || '請稍後再試'
      })
    }
  })

  const onSubmit = (data: ForgetPasswordFormData) => {
    forgetPasswordMutation.mutate(data)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>忘記密碼</CardTitle>
            <CardDescription>請輸入您的電子信箱，我們會發送驗證信件給您</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">電子信箱</Label>

                  <Input type="email" {...register('email')} placeholder="請輸入電子信箱" />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={forgetPasswordMutation.isPending}
                  >
                    {forgetPasswordMutation.isPending ? '發送中...' : '發送重設連結'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
