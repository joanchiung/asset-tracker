'use client'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { BudgetType } from '../types'
import { ErrorMessage } from '@/components/custom/ErrorMessage'

interface BudgetTypeSelectProps {
  value: BudgetType
  onChange: (value: BudgetType) => void
  error?: string
}

export function BudgetTypeSelect({ value, onChange, error }: BudgetTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        交易類型 <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange('income')}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
            ${
              value === 'income'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }
          `}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="font-medium">收入</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('expense')}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
            ${
              value === 'expense'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }
          `}
        >
          <TrendingDown className="h-5 w-5" />
          <span className="font-medium">支出</span>
        </button>
      </div>
      <ErrorMessage message={error} />
    </div>
  )
}
