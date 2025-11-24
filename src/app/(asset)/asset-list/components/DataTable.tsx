'use client'
import React, { useState } from 'react'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  getFilteredRowModel
} from '@tanstack/react-table'
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterSelector } from './dataTable/FilterSelector'
import { PaginationControls } from './dataTable/PaginationControls'
import { ColumnVisibilityToggle } from './dataTable/ColumnVisibilityToggle'
import { FilterConfig, SearchConfig } from './dataTable/types'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCounts: number

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
  totalCounts,
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({})

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
      const newFilters = { ...filtersValue }

      if (!value || value === '') {
        delete newFilters[key]
      } else {
        newFilters[key] = value
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination: paginationState,
      globalFilter: searchValue,
      sorting: sortingState,
      columnFilters: Object.entries(filtersValue)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([key, value]) => value !== 'all' && value !== '')
        .map(([key, value]) => {
          const config = filtersConfig.find((f) => f.key === key)
          const targetType = config?.targetType

          let finalValue: unknown = value

          if (targetType === 'boolean') {
            if (value === 'true') {
              finalValue = true
            } else if (value === 'false') {
              finalValue = false
            }
          } else if (targetType === 'number') {
            const num = Number(value)
            if (!isNaN(num)) {
              finalValue = num
            }
          }

          if (config?.type === 'multiSelect' && typeof value === 'string') {
            finalValue = value.split(',')
          }

          return {
            id: key,
            value: finalValue
          }
        }),

      columnVisibility,
      rowSelection: rowSelectionState
    }
  })

  const renderToolbar = typeof toolbar === 'function' ? toolbar(table) : toolbar

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center justify-between">
          {showSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => searchOnChange(event.target.value)}
              className="max-w-sm"
            />
          )}
          <div className="flex justify-end gap-2">
            {renderToolbar}
            {showColumnVisibilityToggle && <ColumnVisibilityToggle table={table} />}
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap w-full gap-4  items-center rounded-lg">
            {filtersConfig.map((filter) => (
              <FilterSelector
                key={filter.key}
                config={filter}
                value={filtersValue[filter.key] ?? ''}
                onChange={(value) => handleFilterChange(filter.key, value)}
              />
            ))}

            {Object.keys(filtersValue).length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-9">
                清除篩選
              </Button>
            )}
          </div>
        )}
      </div>

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

      {showPagination && <PaginationControls table={table} totalCount={totalCounts} />}
    </div>
  )
}
