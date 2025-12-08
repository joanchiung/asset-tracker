'use client'
import { Control, Controller, UseFormRegister, FieldErrors } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'
import { TransactionFormData } from '../schema/BudgetFormSchema'
import { AmountInput } from '../input/AmountInput'
import { CurrencyInput } from '../input/CurrencyInput'
import { useCurrencies } from '@/hooks/useCurrencies'
import { cryptoCurrenciesData } from '@/data/currencies'

const getAllCurrencies = (majorFiatCodes: string[]) => [
  ...majorFiatCodes,
  ...cryptoCurrenciesData.map((crypto) => crypto.symbol)
]

interface DetailsStepProps {
  control: Control<TransactionFormData>
  register: UseFormRegister<TransactionFormData>
  errors: FieldErrors<TransactionFormData>
  formData: TransactionFormData
}

export function DetailsStep({ control, register, errors, formData }: DetailsStepProps) {
  const { currencies } = useCurrencies()

  const majorFiatCodes = currencies.fiat.map((fiat) => fiat.code)
  const allCurrencies = getAllCurrencies(majorFiatCodes)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          標題 <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register('title')}
          placeholder="例如：ETH 質押利息、午餐費用"
          className="text-base bg-white"
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          金額與幣種 <span className="text-red-500">*</span>
        </Label>

        <div className="flex gap-3">
          <div className="flex-1">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={field.onChange}
                  currency={formData.currency}
                  error={errors.amount?.message}
                />
              )}
            />
          </div>

          <div className="w-[250px]">
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  currencies={allCurrencies}
                  majorFiatCodes={majorFiatCodes}
                  error={errors.currency?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          交易日期 <span className="text-red-500">*</span>
        </Label>
        <Input {...register('transactionDate')} type="date" className="text-base bg-white" />
        {errors.transactionDate && (
          <p className="text-sm text-red-600">{errors.transactionDate.message}</p>
        )}
      </div>
    </div>
  )
}
