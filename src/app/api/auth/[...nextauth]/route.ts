// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("開始驗證用戶:", credentials?.username);

        try {
          const res = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            console.log("API 回應失敗:", res.status, res.statusText);
            return null;
          }

          const data = await res.json();

          if (data?.data?.user) {
            return {
              id: data.data.user.id.toString(),
              name: data.data.user.username,
              email: data.data.user.email,
              token: data.data.token,
              refreshToken: data.data.refreshToken,
            };
          } else {
            console.log("登入失敗: 無效的回應格式");
            return null;
          }
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // 使用類型斷言來解決類型問題
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
