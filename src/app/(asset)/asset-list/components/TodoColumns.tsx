'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Todo } from '@/constant/api/todos/request-response.types'
import { TodoActionsCell } from './TodoActionsCell'

const priorityMap: Record<Todo['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500'
}

export const getTodoColumns = (
  onEditTodo: (todo: Todo) => void,
  token: string
): ColumnDef<Todo>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'completed',
    header: '狀態',
    cell: ({ row }) => (
      <Badge variant={row.original.completed ? 'default' : 'outline'}>
        {row.original.completed ? '已完成' : '待處理'}
      </Badge>
    ),
    enableSorting: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'title',
    enableSorting: false,
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          標題
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>
  },
  {
    accessorKey: 'description',
    header: '內容',
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <>
          <span>{description || '沒有內容'}</span>
        </>
      )
    }
  },
  {
    accessorKey: 'priority',
    enableSorting: true,
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          優先級
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const priority = row.getValue('priority') as Todo['priority']
      return <Badge className={`${priorityMap[priority]} text-white`}>{priority}</Badge>
    }
  },
  {
    accessorKey: 'dueDate',
    enableSorting: true,
    enableGlobalFilter: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          到期日
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string | null
      if (!dueDate) return 'N/A'
      return new Date(dueDate).toLocaleDateString()
    }
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => <TodoActionsCell todo={row.original} onEditTodo={onEditTodo} token={token} />
  }
]
