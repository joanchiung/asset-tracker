export interface FilterOption {
  label: string
  value: string | boolean | number
  count?: number
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiSelect'
  options: FilterOption[] | (() => FilterOption[])
  placeholder?: string
  defaultValue?: string
  width?: string
  targetType: 'string' | 'number' | 'boolean'
}

export interface SearchConfig {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchableFields?: string[]
}
