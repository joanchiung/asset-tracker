'use client'
import { Input } from '@/components/ui/input'
import { ErrorMessage } from '@/components/custom/ErrorMessage'

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  currency: string
  error?: string
}

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="text-lg font-mono bg-white"
        aria-label="交易金額"
        aria-invalid={!!error}
      />
      <ErrorMessage message={error} />
    </div>
  )
}
