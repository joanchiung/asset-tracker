import React from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import { TrendingUp, TrendingDown, Tag } from 'lucide-react'
import { TransactionFormData } from '../schema/TransactionFormSchema'

interface MainTypeSelectorProps {
  control: Control<TransactionFormData>
  error?: FieldError
}

export const MainTypeSelector: React.FC<MainTypeSelectorProps> = ({ control, error }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Tag className="h-4 w-4" />
        交易類型 <span className="text-red-500">*</span>
      </label>

      <Controller
        name="mainType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => field.onChange('income')}
              className={`p-4 rounded-lg border-2 transition-all ${
                field.value === 'income'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">收入</div>
              <div className="text-xs text-gray-500">錢進來了</div>
            </button>

            <button
              type="button"
              onClick={() => field.onChange('expense')}
              className={`p-4 rounded-lg border-2 transition-all ${
                field.value === 'expense'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <TrendingDown className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">支出</div>
              <div className="text-xs text-gray-500">錢花出去了</div>
            </button>
          </div>
        )}
      />

      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
