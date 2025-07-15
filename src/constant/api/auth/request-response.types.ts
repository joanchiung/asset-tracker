import { ApiDefinition, EnumApiMethod } from '..'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    phone?: string
  }
}

interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

interface UserInfo {
  id: number
  username: string
  email: string
  phone?: string
  createdAt: string
}

type Login = ApiDefinition<
  '/auth/login',
  EnumApiMethod.POST,
  undefined,
  LoginRequest,
  LoginResponse
>

type Register = ApiDefinition<
  '/auth/register',
  EnumApiMethod.POST,
  undefined,
  RegisterRequest,
  UserInfo
>

export type AuthApiList = {
  Login: Login
  Register: Register
  // LogOut: LogOut
  // AuthOTP: AuthOTP
  // AuthOTPVerify: AuthOTPVerify
  // Register: Register
  // ForgetPassword: ForgetPassword
  // ForgetPWDAndResetPWD: ForgetPWDAndResetPWD
  // ResetPassword: ResetPassword
  // GetAuthUser: GetAuthUser
}
