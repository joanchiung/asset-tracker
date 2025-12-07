import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cryptoCurrenciesData } from '@/data/currencies'

interface Props {
  amount: string
  currency: string
  onAmountChange: (value: string) => void
  onCurrencyChange: (value: string) => void
  majorFiatCodes: string[]
  amountError?: string
  currencyError?: string
}

export default function CurrencyAmountInput({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  majorFiatCodes,
  amountError,
  currencyError
}: Props) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        金額與幣種 <span className="text-red-500">*</span>
      </Label>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="text-lg font-mono"
            aria-label="交易金額"
            aria-invalid={!!amountError}
          />
          <ErrorMessage message={amountError} />
        </div>

        <div className="w-[250px]">
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger aria-label="選擇幣種">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">法幣</div>
              {majorFiatCodes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
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
          <ErrorMessage message={currencyError} />
        </div>
      </div>
    </div>
  )
}

interface ErrorMessageProps {
  message?: string
  id?: string
}

export function ErrorMessage({ message, id }: ErrorMessageProps) {
  if (!message) return null

  return (
    <p id={id} className="text-sm text-red-600 mt-1">
      {message}
    </p>
  )
}
