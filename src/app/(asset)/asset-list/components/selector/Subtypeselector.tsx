import React from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import { TransactionFormData } from '../schema/TransactionFormSchema'
import { transactionTypeOptions, MainTransactionType } from '../constants/TransactionConfig'

interface SubTypeSelectorProps {
  control: Control<TransactionFormData>
  mainType: MainTransactionType
  error?: FieldError
}

export const SubTypeSelector: React.FC<SubTypeSelectorProps> = ({ control, mainType, error }) => {
  const options = transactionTypeOptions[mainType]

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        {mainType === 'income' ? '收入' : '支出'}類別 <span className="text-red-500">*</span>
      </label>

      <Controller
        name="subType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((option) => {
              const IconComponent = option.icon
              const isSelected = field.value === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              )
            })}
          </div>
        )}
      />

      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
