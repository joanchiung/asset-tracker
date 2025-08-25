import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCurrencies } from '@/hooks/useCurrencies'

interface CurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function CurrencySelector({
  value,
  onValueChange,
  placeholder = '選擇幣種'
}: CurrencySelectorProps) {
  const { currencies } = useCurrencies()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* 法定貨幣群組 */}
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">法定貨幣</div>
        {currencies.fiat.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{currency.code}</span>
              <span className="text-gray-500">- {currency.displayName}</span>
            </div>
          </SelectItem>
        ))}

        {/* 分隔線 */}
        <div className="border-t border-gray-200 my-1" />

        {/* 加密貨幣群組 */}
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">加密貨幣</div>
        {currencies.crypto.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{currency.code}</span>
              <span className="text-gray-500">- {currency.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
