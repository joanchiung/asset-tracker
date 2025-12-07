import { z } from 'zod'

/**
 * 創建交易表單的驗證 schema
 * @param currencies - 可用的貨幣代碼列表
 */
export const createTransactionFormSchema = (currencies: string[]) =>
  z.object({
    title: z.string().min(1, '請輸入標題'),
    amount: z.string().min(1, '請輸入金額'),
    currency: z.enum(currencies as [string, ...string[]]),
    mainType: z.enum(['income', 'expense']),
    subType: z.string().min(1, '請選擇子類型'),
    priority: z.enum(['high', 'medium', 'low']),
    transactionDate: z.string().min(1, '請選擇日期')
  })

/**
 * 交易表單數據類型（需要在使用時根據實際 currencies 推導）
 */
export type TransactionFormData = z.infer<ReturnType<typeof createTransactionFormSchema>>
