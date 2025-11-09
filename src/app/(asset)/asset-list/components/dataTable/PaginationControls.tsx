'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'

interface PaginationControlsProps<TData> {
  table: Table<TData>
  totalCount: number
}

export function PaginationControls<TData>({ table, totalCount }: PaginationControlsProps<TData>) {
  const { pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">共 {totalCount} 筆資料</div>
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
