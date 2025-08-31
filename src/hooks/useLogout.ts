import { useMutation } from '@tanstack/react-query'
import { fetchFunc } from '@/lib/axios'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

export function useLogout() {
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

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return {
    logout: handleLogout,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error
  }
}
