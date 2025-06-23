// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string;
  }
}
