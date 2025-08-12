import { z } from 'zod'
import {
  loginSchema,
  signUpSchema,
  resetPasswordSchema,
  changePasswordSchema
} from './auth-schemas'
import { updateUserSchema } from './user-schemas'

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
