import { z } from "zod";
import {
  validateUsername,
  validatePassword,
  validatePhone,
  validateEmail,
} from "@/lib/utils";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "此欄位為必填" })
      .refine(validateUsername, {
        message: "用戶名稱須為 3-20 字元，僅限英數字",
      }),
    email: z
      .string()
      .min(1, { message: "此欄位為必填" })
      .email({ message: "請輸入有效的電子信箱格式" })
      .refine(validateEmail, {
        message: "電子信箱格式不正確",
      }),
    password: z
      .string()
      .min(1, { message: "此欄位為必填" })
      .refine(validatePassword, {
        message: "密碼須至少8字元，包含大小寫、數字和特殊符號",
      }),
    confirmPassword: z.string().min(1, { message: "請確認密碼" }),
    phone: z
      .string()
      .optional()
      .refine((phone) => !phone || validatePhone(phone), {
        message: "手機號碼格式錯誤，須為10位數字",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼與確認密碼不符",
    path: ["confirmPassword"],
  });
