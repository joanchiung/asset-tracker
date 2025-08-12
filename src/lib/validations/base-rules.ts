import { z } from 'zod'

export const BaseValidationRules = {
  required: (message = '此欄位為必填') => z.string().min(1, { message }),

  email: z
    .string()
    .min(1, { message: '請輸入電子信箱' })
    .email({ message: '請輸入有效的電子信箱格式' }),

  password: z
    .string()
    .min(8, { message: '密碼至少需要 8 個字元' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: '密碼需包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊符號'
    }),

  username: z
    .string()
    .min(3, { message: '用戶名稱長度需介於 3 到 20 字元之間' })
    .max(20, { message: '用戶名稱長度需介於 3 到 20 字元之間' }),

  phone: z.string().regex(/^[0-9]{10}$/, { message: '電話號碼必須是 10 位數字' }),

  token: z.string().min(1, { message: '無效的重設 token' })
}

export const OptionalField = {
  username: BaseValidationRules.username.or(z.literal('')).optional(),
  phone: BaseValidationRules.phone.or(z.literal('')).optional()
}

export const passwordConfirmation = (
  passwordField = 'password',
  confirmField = 'confirmPassword',
  message = '兩次輸入的密碼不一致'
) => {
  return (data: any) => data[passwordField] === data[confirmField]
}
