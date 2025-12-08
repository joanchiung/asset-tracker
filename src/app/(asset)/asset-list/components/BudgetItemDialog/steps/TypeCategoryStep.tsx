'use client'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { BudgetTypeSelect } from '../select/BudgetTypeSelect'
import { CategorySelect } from '../select/CategorySelect'
import { TransactionFormData } from '../schema/BudgetFormSchema'

interface TypeCategoryStepProps {
  control: Control<TransactionFormData>
  errors: FieldErrors<TransactionFormData>
  mainType: 'income' | 'expense'
}

export function TypeCategoryStep({ control, errors, mainType }: TypeCategoryStepProps) {
  return (
    <div className="space-y-6">
      <Controller
        name="mainType"
        control={control}
        render={({ field }) => (
          <BudgetTypeSelect
            value={field.value}
            onChange={field.onChange}
            error={errors.mainType?.message}
          />
        )}
      />

      <Controller
        name="subType"
        control={control}
        render={({ field }) => (
          <CategorySelect
            value={field.value}
            onChange={field.onChange}
            mainType={mainType}
            error={errors.subType?.message}
          />
        )}
      />
    </div>
  )
}
