// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { fetchFunc } from '@/lib/axios'
import type { JWT } from 'next-auth/jwt'
import type { Session, User } from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const { username, password } = credentials as { username: string; password: string }

        try {
          const result = await fetchFunc({
            key: 'Login',
            request: {
              username: username,
              password: password
            }
          })

          if (result && result.data?.user) {
            const userObj = {
              id: String(result.data.user.id),
              email: result.data.user.email,
              name: result.data.user.username,
              accessToken: result.data.token,
              refreshToken: result.data.refreshToken
            }
            return userObj
          }
          return null
        } catch (error) {
          console.error('登入驗證失敗:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
      }
      return session
    },
    // 新增：處理已登入用戶訪問登入頁的重導向
    async redirect({ url, baseUrl }) {
      // 如果用戶已登入且嘗試訪問登入相關頁面，重導向到 dashboard
      if (url.includes('/login') || url.includes('/signup') || url.includes('/forget-pwd')) {
        return `${baseUrl}/user-portfolio`
      }

      // 允許相對 URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }

      // 允許同域的 URL
      if (new URL(url).origin === baseUrl) {
        return url
      }

      return baseUrl
    }
  },
  pages: {
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
})

export const { GET, POST } = handlers
