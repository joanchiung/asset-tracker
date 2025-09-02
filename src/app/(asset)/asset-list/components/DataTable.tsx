import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  Table
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface PaginationControlsProps<TData> {
  table: Table<TData>
}

function PaginationControls<TData>({ table }: PaginationControlsProps<TData>) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        共 {table.getFilteredRowModel().rows.length} 筆資料.
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">每頁顯示</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
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
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  // 讓 toolbar 成為一個 render prop，可以傳入任何 React.ReactNode 或一個接受 table 實例的函式
  toolbar?: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode)
  // 新增篩選功能相關 props
  globalFilter?: string // 全局篩選值
  onGlobalFilterChange?: OnChangeFn<string> // 全局篩選值的改變事件
  filterableColumnId?: string // 指定哪個欄位可以進行篩選 (例如： 'name' 或 'email')
  showPagination?: boolean // 控制是否顯示分頁
  showColumnVisibilityToggle?: boolean // 控制是否顯示欄位可見性開關
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  toolbar,
  globalFilter,
  onGlobalFilterChange,
  filterableColumnId,
  showPagination = true,
  showColumnVisibilityToggle = true
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    manualPagination: pageCount !== undefined,
    manualSorting: sorting !== undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    state: {
      sorting: sorting ?? [],
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: pagination ?? { pageIndex: 0, pageSize: 10 },
      globalFilter: globalFilter
    },
    onGlobalFilterChange: onGlobalFilterChange
  })

  const renderToolbar = typeof toolbar === 'function' ? toolbar(table) : toolbar

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {filterableColumnId && (
          <Input
            placeholder={`篩選 ${filterableColumnId}...`}
            value={(table.getColumn(filterableColumnId)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(filterableColumnId)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {onGlobalFilterChange && (
          <Input
            placeholder="全局篩選..."
            value={globalFilter ?? ''}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            className="max-w-sm ml-2"
          />
        )}

        <div className="flex-grow flex justify-end gap-2">
          {renderToolbar}
          {showColumnVisibilityToggle && <ColumnVisibilityToggle table={table} />}
        </div>
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

      {showPagination && <PaginationControls table={table} />}
    </div>
  )
}
