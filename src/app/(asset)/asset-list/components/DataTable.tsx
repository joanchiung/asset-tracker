'use client'
import React, { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  Table
} from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface PaginationControlsProps<TData> {
  table: Table<TData>
  totalCount: number
}

function PaginationControls<TData>({ table, totalCount }: PaginationControlsProps<TData>) {
  const { pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">共 {totalCount} 筆資料.</div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">每頁顯示</span>
        <select
          value={pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">筆</span>
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          第一頁
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          上一頁
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          下一頁
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          最後一頁
        </Button>
      </div>
    </div>
  )
}

interface ColumnVisibilityToggleProps<TData> {
  table: Table<TData>
}

function ColumnVisibilityToggle<TData>({ table }: ColumnVisibilityToggleProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          顯示/隱藏欄位
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === 'string'
                  ? column.columnDef.header
                  : String(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiSelect'
  options: FilterOption[] | (() => FilterOption[])
  placeholder?: string
  defaultValue?: string
  width?: string
}

interface FilterSelectorProps {
  config: FilterConfig
  value: string
  onChange: (value: string) => void
}

function FilterSelector({ config, value, onChange }: FilterSelectorProps) {
  const options = typeof config.options === 'function' ? config.options() : config.options

  const selectedValues = React.useMemo(() => {
    const result = value ? value.split(',') : []
    return result
  }, [value])

  // 處理多選邏輯
  const handleMultiSelectChange = React.useCallback(
    (optionValue: string, isChecked: boolean) => {
      const currentSelectedValues = value ? value.split(',') : []

      let newSelectedValues: string[]
      if (isChecked) {
        newSelectedValues = Array.from(new Set([...currentSelectedValues, optionValue]))
      } else {
        newSelectedValues = currentSelectedValues.filter((val) => val !== optionValue)
      }

      onChange(newSelectedValues.join(','))
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
            <SelectItem value="all">全部{config.label}</SelectItem>
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
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => option.label)
                    .join(', ')
                : config.placeholder || `選擇${config.label}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>{config.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {options.map((option) => {
              const isChecked = selectedValues.includes(option.value)
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleMultiSelectChange(option.value, checked)}
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

interface SearchConfig {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchableFields?: string[]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: {
    state?: PaginationState
    onChange?: OnChangeFn<PaginationState>
    pageCount?: number
    show?: boolean
  }
  sorting?: {
    state?: SortingState
    onChange?: OnChangeFn<SortingState>
  }
  search?: SearchConfig
  filters?: {
    config?: FilterConfig[]
    value?: Record<string, string>
    onChange?: (filters: Record<string, string>) => void
  }

  rowSelection?: {
    state?: RowSelectionState
    onChange?: OnChangeFn<RowSelectionState>
    getRowId?: (row: TData) => string
  }

  toolbar?: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode)
  showColumnVisibilityToggle?: boolean
}

export function DataTable<TData, TValue>({
  data,
  columns,
  pagination,
  sorting,
  search,
  filters,
  rowSelection,
  toolbar,
  showColumnVisibilityToggle = true
}: DataTableProps<TData, TValue>) {
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>('')
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [internalFilters, setInternalFilters] = React.useState<Record<string, string>>({})

  const paginationState = pagination?.state ?? internalPagination
  const paginationOnChange = pagination?.onChange ?? setInternalPagination
  const paginationPageCount = pagination?.pageCount
  const showPagination = pagination?.show ?? true

  const searchValue = search?.value ?? internalGlobalFilter
  const searchOnChange = search?.onChange ?? setInternalGlobalFilter
  const searchPlaceholder = search?.placeholder ?? '搜尋...'
  const showSearch = !!search

  const sortingState = sorting?.state ?? internalSorting
  const sortingOnChange = sorting?.onChange ?? setInternalSorting

  const rowSelectionState = rowSelection?.state ?? internalRowSelection
  const rowSelectionOnChange = rowSelection?.onChange ?? setInternalRowSelection
  const getRowId = rowSelection?.getRowId

  const filtersConfig = filters?.config ?? []
  const filtersValue = filters?.value ?? internalFilters
  const filtersOnChange = filters?.onChange ?? setInternalFilters
  const showFilters = filtersConfig.length > 0

  const handleFilterChange = React.useCallback(
    (key: string, value: string) => {
      const newFilters = { ...filtersValue, [key]: value }

      if (!value || value === '') {
        delete newFilters[key]
      }

      filtersOnChange(newFilters)
    },
    [filtersValue, filtersOnChange]
  )

  const clearAllFilters = React.useCallback(() => {
    filtersOnChange({})
  }, [filtersOnChange])

  const table = useReactTable({
    data,
    columns,
    pageCount: paginationPageCount ?? -1,
    manualPagination: paginationPageCount !== undefined,
    onPaginationChange: paginationOnChange,
    onGlobalFilterChange: searchOnChange,
    manualSorting: sorting?.state !== undefined,
    onSortingChange: sortingOnChange,
    ...(getRowId && { getRowId }),
    onRowSelectionChange: rowSelectionOnChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination: paginationState,
      globalFilter: searchValue,
      sorting: sortingState,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelectionState
    }
  })

  const renderToolbar = typeof toolbar === 'function' ? toolbar(table) : toolbar

  return (
    <div className="flex flex-col gap-4">
      {/* 搜尋和篩選區域 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {/* 搜尋輸入框 */}
          {showSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => searchOnChange(event.target.value)}
              className="max-w-sm"
            />
          )}

          {/* 右側工具列 */}
          <div className="flex-grow flex justify-end gap-2">
            {renderToolbar}
            {showColumnVisibilityToggle && <ColumnVisibilityToggle table={table} />}
          </div>
        </div>

        {/* 篩選器區域 */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-muted/10 rounded-lg">
            {filtersConfig.map((filter) => (
              <FilterSelector
                key={filter.key}
                config={filter}
                value={filtersValue[filter.key] ?? ''}
                onChange={(value) => handleFilterChange(filter.key, value)}
              />
            ))}

            {/* 清除篩選按鈕 */}
            {Object.keys(filtersValue).length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-9">
                清除篩選
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <ShadcnTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  沒有資料。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadcnTable>
      </div>

      {/* 分頁控制 */}
      {showPagination && (
        <PaginationControls
          table={table}
          totalCount={
            paginationPageCount ? paginationPageCount * paginationState.pageSize : data.length
          }
        />
      )}
    </div>
  )
}
