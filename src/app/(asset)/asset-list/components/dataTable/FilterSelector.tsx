'use client'
import React, { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { FilterConfig } from './types'

interface FilterSelectorProps {
  config: FilterConfig
  value: string
  onChange: (value: string) => void
}

export function FilterSelector({ config, value, onChange }: FilterSelectorProps) {
  const options = typeof config.options === 'function' ? config.options() : config.options

  const selectedValues = useMemo(() => {
    const result = value ? value.split(',') : []
    return result
  }, [value])

  const handleMultiSelectChange = React.useCallback(
    (optionValue: string, isChecked: boolean) => {
      const currentSelectedValues = value ? value.split(',') : []

      let newSelectedValues: string[]
      if (isChecked) {
        newSelectedValues = Array.from(new Set([...currentSelectedValues, optionValue]))
      } else {
        newSelectedValues = currentSelectedValues.filter((val) => val !== optionValue)
      }
      const finalValue = newSelectedValues.join(',')

      onChange(finalValue)
    },
    [value, onChange]
  )

  if (config.type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{config.label}</label>
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className={`${config.width || 'w-48'} h-9`}>
            <SelectValue placeholder={config.placeholder || `選擇${config.label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {options.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {option.label}
                {option.count && ` (${option.count})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (config.type === 'multiSelect') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{config.label}</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`${config.width || 'w-48'} h-9 justify-start`}>
              {selectedValues.length > 0
                ? options
                    .filter((option) => selectedValues.includes(String(option.value)))
                    .map((option) => option.label)
                    .join(', ')
                : config.placeholder || `選擇${config.label}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>{config.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {options.map((option) => {
              const optionValueString = String(option.value)
              const isChecked = selectedValues.includes(optionValueString)
              return (
                <DropdownMenuCheckboxItem
                  key={optionValueString}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleMultiSelectChange(optionValueString, checked)}
                >
                  {option.label}
                  {option.count && ` (${option.count})`}
                </DropdownMenuCheckboxItem>
              )
            })}

            {selectedValues.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive"
                  onClick={() => onChange('')}
                >
                  清除所有
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return null
}
