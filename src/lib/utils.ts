import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 驗證用戶名稱：3-20字元，僅限英數字
export function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9]{3,20}$/.test(username);
}

// 驗證密碼：至少8字元，包含大小寫、數字和特殊符號
export function validatePassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

// 驗證手機號碼：10位數字（台灣格式）
export function validatePhone(phone: string): boolean {
  return phone === "" || /^\d{10}$/.test(phone);
}

// 驗證電子信箱格式
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 密碼強度檢查的詳細訊息（可選用）
export function getPasswordStrengthMessage(password: string): string {
  if (password.length < 8) {
    return "密碼至少需要8個字元";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "密碼必須包含小寫字母";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "密碼必須包含大寫字母";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "密碼必須包含數字";
  }
  if (!/(?=.*[\W_])/.test(password)) {
    return "密碼必須包含特殊符號";
  }
  return "";
}
