import { ApiDefinition, EnumApiMethod } from '@/constant/api/index'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  refreshToken: string
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

export interface Email {
  email: string
}

interface ResetPWDrequest {
  token: string
  newPassword: string
  confirmNewPassword: string
}

interface ChangePWDrequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
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

type Logout = ApiDefinition<'/auth/logout', EnumApiMethod.POST, undefined, undefined, undefined>

type ForgetPWD = ApiDefinition<
  '/auth/forgot-password',
  EnumApiMethod.POST,
  undefined,
  Email,
  undefined
>

type ResetPWD = ApiDefinition<
  '/auth/reset-password',
  EnumApiMethod.POST,
  undefined,
  ResetPWDrequest,
  undefined
>

type ChangePWD = ApiDefinition<
  '/auth/change-password',
  EnumApiMethod.POST,
  undefined,
  ChangePWDrequest,
  undefined
>

export type AuthApiList = {
  Login: Login
  Register: Register
  Logout: Logout

  ForgetPWD: ForgetPWD
  ResetPWD: ResetPWD
  ChangePWD: ChangePWD
}
