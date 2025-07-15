'use client'
/* Next.js  */
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

/* tanstack */
import { useMutation } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'

/* NextAuth */
import { signIn } from 'next-auth/react'

type LoginForm = {
  username: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()

  const loginSchema = z.object({
    username: z.string().min(1, { message: '此欄位為必填' }),
    password: z.string().min(1, { message: '請輸入密碼' })
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await fetchFunc({
        key: 'Login',
        request: {
          username: data.username,
          password: data.password
        }
      })
      return res
    },
    onSuccess: () => {
      toast('登入成功', {
        description: '正在為您跳轉到用戶面板...',
        duration: 2000
      })
      router.push('/user-portfolio')
    },

    onError: (error: Error) => {
      const errorMessage =
        error.message === 'CredentialsSignin'
          ? '登入失敗，帳號或密碼錯誤'
          : error.message || '登入失敗，請稍後再試'

      toast('登入失敗', {
        description: errorMessage,
        duration: 4000,
        action: {
          label: '重試',
          onClick: () => console.log('準備重試登入')
        }
      })
    }
  })

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data)
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

  const finalIsLoading = loginMutation.isPending || isSubmitting

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
                    disabled={finalIsLoading}
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
                    disabled={finalIsLoading}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {loginMutation.error && (
                  <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-md">
                    {loginMutation.error.message}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={finalIsLoading}>
                    {finalIsLoading ? '登入中...' : '登入'}
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
