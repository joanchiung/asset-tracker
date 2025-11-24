import React from 'react'
import { Control, Controller, UseFormRegister, FieldError } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TransactionFormData } from '../schema/TransactionFormSchema'
import { cryptoCurrenciesData } from '@/data/currencies'

interface CurrencyAmountInputProps {
  register: UseFormRegister<TransactionFormData>
  control: Control<TransactionFormData>
  majorFiatCodes: string[]
  amountError?: FieldError
  currencyError?: FieldError
}

export const CurrencyAmountInput: React.FC<CurrencyAmountInputProps> = ({
  register,
  control,
  majorFiatCodes,
  amountError,
  currencyError
}) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">
        金額與幣種 <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            {...register('amount', {
              valueAsNumber: true,
              setValueAs: (value) => {
                if (value === '' || value === null || value === undefined) {
                  return undefined
                }
                const parsed = parseFloat(value)
                return isNaN(parsed) ? undefined : parsed
              }
            })}
            type="number"
            step="any"
            placeholder="0.00"
            className="text-lg font-mono"
          />
          {amountError && <p className="text-sm text-red-600 mt-1">{amountError.message}</p>}
        </div>

        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                  法幣
                </div>
                {majorFiatCodes.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}

                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                  加密貨幣
                </div>
                {cryptoCurrenciesData.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {currencyError && <p className="text-sm text-red-600">{currencyError.message}</p>}
    </div>
  )
}
