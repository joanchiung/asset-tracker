// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    email?: string | null
    name?: string | null
    accessToken?: string
    refreshToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    id?: string
  }
}
