'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Todo } from '@/constant/api/todos/request-response.types'

const PRIORITY_OPTIONS = [
  { value: 'low', label: '🟢 低', color: 'text-green-600' },
  { value: 'medium', label: '🟡 中', color: 'text-yellow-600' },
  { value: 'high', label: '🔴 高', color: 'text-red-600' }
] as const

export interface PrioritySelectProps {
  value: Todo['priority']
  onChange: (value: Todo['priority']) => void
  error?: string
}

export function PrioritySelect({ value, onChange, error }: PrioritySelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">優先級</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="選擇優先級" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className={option.color}>{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
