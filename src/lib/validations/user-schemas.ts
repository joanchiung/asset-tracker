import { z } from 'zod'
import { OptionalField } from './base-rules'

export const updateUserSchema = z.object({
  username: OptionalField.username,
  phone: OptionalField.phone
})
