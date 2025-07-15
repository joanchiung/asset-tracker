// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { fetchFunc } from '@/lib/axios'
import type { JWT } from 'next-auth/jwt'
import type { Session, User } from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

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
            return {
              id: String(result.data.user.id),
              email: result.data.user.email,
              name: result.data.user.username,
              accessToken: result.data.token
            }
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
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
})

export const { GET, POST } = handlers
