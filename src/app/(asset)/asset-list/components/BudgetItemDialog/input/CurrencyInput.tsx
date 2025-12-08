'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cryptoCurrenciesData } from '@/data/currencies'
import { ErrorMessage } from '@/components/custom/ErrorMessage'

interface CurrencyInputProps {
  value: string
  onChange: (value: string) => void
  currencies: string[]
  majorFiatCodes: string[]
  error?: string
}

export function CurrencyInput({ value, onChange, majorFiatCodes, error }: CurrencyInputProps) {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label="選擇幣種" className="bg-white">
          <SelectValue placeholder="選擇幣種" />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">法幣</div>
          {majorFiatCodes.map((code) => (
            <SelectItem key={code} value={code}>
              {code}
            </SelectItem>
          ))}

          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border-t">
            加密貨幣
          </div>
          {cryptoCurrenciesData.map((crypto) => (
            <SelectItem key={crypto.symbol} value={crypto.symbol}>
              <div className="flex items-center gap-2">
                <span>{crypto.symbol}</span>
                <span className="text-xs text-gray-500">{crypto.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorMessage message={error} />
    </div>
  )
}
