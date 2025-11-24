import {
  Coins,
  Briefcase,
  Hammer,
  TrendingUpIcon,
  Home,
  ShoppingCart,
  BookOpen,
  Heart,
  Plane,
  Car,
  Flame,
  Zap,
  Moon,
  type LucideIcon
} from 'lucide-react'

/**
 * 交易子類型選項介面
 */
export interface TransactionTypeOption {
  value: string
  label: string
  desc: string
  icon: LucideIcon
}

/**
 * 收入類型選項
 */
export const incomeTypeOptions: TransactionTypeOption[] = [
  {
    value: '配息',
    label: '配息',
    desc: '股票、基金配息收入',
    icon: Coins
  },
  {
    value: '本業收入',
    label: '本業收入',
    desc: '薪資、獎金等',
    icon: Briefcase
  },
  {
    value: '接案收入',
    label: '接案收入',
    desc: '自由接案、兼職收入',
    icon: Hammer
  },
  {
    value: '投資收益',
    label: '投資收益',
    desc: '股票、加密貨幣收益',
    icon: TrendingUpIcon
  }
]

/**
 * 支出類型選項
 */
export const expenseTypeOptions: TransactionTypeOption[] = [
  {
    value: '貸款',
    label: '貸款',
    desc: '房貸、車貸等',
    icon: Home
  },
  {
    value: '日常生活費',
    label: '日常生活費',
    desc: '食物、用品等',
    icon: ShoppingCart
  },
  {
    value: '學習資金',
    label: '學習資金',
    desc: '課程、書籍等',
    icon: BookOpen
  },
  {
    value: '醫療保險',
    label: '醫療保險',
    desc: '醫療費用、保險費',
    icon: Heart
  },
  {
    value: '旅遊',
    label: '旅遊',
    desc: '旅行、娛樂支出',
    icon: Plane
  },
  {
    value: '交通費',
    label: '交通費',
    desc: '油費、大眾運輸等',
    icon: Car
  }
]

/**
 * 所有交易類型選項（按主類型分組）
 */
export const transactionTypeOptions = {
  income: incomeTypeOptions,
  expense: expenseTypeOptions
} as const

/**
 * 優先級配置介面
 */
export interface PriorityConfig {
  label: string
  color: string
  icon: LucideIcon
}

/**
 * 優先級配置映射
 */
export const priorityConfigMap: Record<'high' | 'medium' | 'low', PriorityConfig> = {
  high: {
    label: '重要',
    color: 'border-red-500 bg-red-50 text-red-700',
    icon: Flame
  },
  medium: {
    label: '中等',
    color: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    icon: Zap
  },
  low: {
    label: '一般',
    color: 'border-green-500 bg-green-50 text-green-700',
    icon: Moon
  }
}

/**
 * 主交易類型列表
 */
export type MainTransactionType = 'income' | 'expense'

/**
 * 優先級類型
 */
export type PriorityType = keyof typeof priorityConfigMap
