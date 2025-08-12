import { z } from 'zod'
import { BaseValidationRules, passwordConfirmation } from './base-rules'

export const loginSchema = z.object({
  username: BaseValidationRules.required(),
  password: BaseValidationRules.required('請輸入密碼')
})

export const signUpSchema = z
  .object({
    username: BaseValidationRules.username,
    email: BaseValidationRules.email,
    password: BaseValidationRules.password,
    confirmPassword: z.string(),
    phone: BaseValidationRules.phone.optional()
  })
  .refine((data) => passwordConfirmation('password', 'confirmPassword')(data), {
    message: '兩次輸入的密碼不一致',
    path: ['confirmPassword']
  })

export const resetPasswordSchema = z
  .object({
    token: BaseValidationRules.token,
    newPassword: BaseValidationRules.password,
    confirmNewPassword: z.string()
  })
  .refine((data) => passwordConfirmation('newPassword', 'confirmNewPassword')(data), {
    message: '兩次輸入的密碼不一致',
    path: ['confirmNewPassword']
  })

export const forgetPasswordSchema = z.object({
  email: BaseValidationRules.email
})

export const changePasswordSchema = z
  .object({
    currentPassword: BaseValidationRules.required('請輸入目前密碼'),
    newPassword: BaseValidationRules.password,
    confirmNewPassword: z.string()
  })
  .refine((data) => passwordConfirmation('newPassword', 'confirmNewPassword')(data), {
    message: '新密碼與確認密碼不相符',
    path: ['confirmNewPassword']
  })
