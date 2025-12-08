import { Todo } from '@/constant/api/todos/request-response.types'

export type BudgetType = 'income' | 'expense'

export interface BudgetFormData {
  mainType: BudgetType
  title: string
  amount: string
  currency: string
  subType: string
  priority: Todo['priority']
  transactionDate: string
}
