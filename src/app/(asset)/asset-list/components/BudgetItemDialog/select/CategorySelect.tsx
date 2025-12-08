'use client'
import { BudgetType } from '../types'
import {
  incomeTypeOptions,
  expenseTypeOptions
} from '@/app/(asset)/asset-list/components/constants/TransactionConfig'
import { ErrorMessage } from '@/components/custom/ErrorMessage'

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  mainType: BudgetType
  error?: string
}

export function CategorySelect({ value, onChange, mainType, error }: CategorySelectProps) {
  const categories = mainType === 'income' ? incomeTypeOptions : expenseTypeOptions

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        類別 <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = value === category.value

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onChange(category.value)}
              className={`
                flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? mainType === 'income'
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`h-5 w-5 ${
                    isSelected
                      ? mainType === 'income'
                        ? 'text-green-700'
                        : 'text-red-700'
                      : 'text-gray-600'
                  }`}
                />
                <span
                  className={`font-medium ${
                    isSelected
                      ? mainType === 'income'
                        ? 'text-green-700'
                        : 'text-red-700'
                      : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </span>
              </div>
              <span className="text-xs text-gray-500">{category.desc}</span>
            </button>
          )
        })}
      </div>

      <ErrorMessage message={error} />
    </div>
  )
}
