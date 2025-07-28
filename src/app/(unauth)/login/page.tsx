'use client'
/* Next.js  */
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/* component */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

/* form  verify */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/* NextAuth */
import { signIn } from 'next-auth/react'

type LoginForm = {
  username: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const loginSchema = z.object({
    username: z.string().min(1, { message: '此欄位為必填' }),
    password: z.string().min(1, { message: '請輸入密碼' })
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      })

      if (result && !result.error) {
        toast.success('登入成功', {
          description: '正在為您跳轉到用戶面板...',
          duration: 2000
        })

        router.push('/user-portfolio')
      } else {
        toast.error('登入失敗', {
          description: '用戶名稱或密碼錯誤，請重新確認。',
          duration: 4000
        })
      }
    } catch (error) {
      console.error('An unexpected error occurred during sign in:', error)
      toast.error('登入時發生預期外的錯誤', {
        description: '請檢查您的網路連線並稍後再試。'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/user-portfolio'
      })
    } catch {
      toast('Google 登入失敗', {
        description: '請稍後再試',
        duration: 4000
      })
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>登入帳號</CardTitle>
            <CardDescription>輸入帳號與密碼來登入</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">使用者名稱</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="輸入帳號"
                    disabled={isLoading}
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密碼</Label>
                    <Link
                      href="/forget-pwd"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      忘記密碼？
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="輸入密碼"
                    disabled={isLoading}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '登入中...' : '登入'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={handleGoogleLogin}
                  >
                    使用 Google 帳號登入
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                還沒有帳號嗎？
                <Link href="/signup" className="underline underline-offset-4">
                  前往註冊
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
