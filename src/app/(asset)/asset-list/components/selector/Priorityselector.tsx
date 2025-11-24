import React from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { TransactionFormData } from '../schema/TransactionFormSchema'
import { priorityConfigMap, PriorityType } from '../constants/TransactionConfig'

interface PrioritySelectorProps {
  control: Control<TransactionFormData>
  error?: FieldError
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ control, error }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        優先級
      </label>

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <div className="flex flex-row gap-2">
            {(
              Object.entries(priorityConfigMap) as [
                PriorityType,
                (typeof priorityConfigMap)[PriorityType]
              ][]
            ).map(([value, config]) => {
              const IconComponent = config.icon
              const isSelected = field.value === value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.onChange(value)}
                  className={`w-full p-2 text-left rounded-lg border transition-all ${
                    isSelected ? config.color : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
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
