import { ApiDefinition, EnumApiMethod } from '..'

interface UserProfile {
  user: {
    id: number
    username: string
    email: string
    phone: string
    isVerified: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

interface UpdateProfileRequest {
  username?: string
  phone?: string
}

type GetProfile = ApiDefinition<
  '/user/profile',
  EnumApiMethod.GET,
  undefined,
  undefined,
  UserProfile
>

type UpdateProfile = ApiDefinition<
  '/user/profile',
  EnumApiMethod.PUT,
  undefined,
  UpdateProfileRequest,
  UserProfile
>

export type UserApiList = {
  GetProfile: GetProfile
  UpdateProfile: UpdateProfile
}
