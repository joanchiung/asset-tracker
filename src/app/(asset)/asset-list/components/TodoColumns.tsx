'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Todo } from '@/constant/api/todos/request-response.types'

const priorityMap: Record<Todo['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500'
}

interface ColumnsProps {
  onConfirm: (id: number) => void
}

export const columns = ({ onConfirm }: ColumnsProps): ColumnDef<Todo>[] => [
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
    )
  },
  {
    accessorKey: 'title',
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
    header: '優先級',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as Todo['priority']
      return <Badge className={`${priorityMap[priority]} text-white`}>{priority}</Badge>
    }
  },
  {
    accessorKey: 'dueDate',
    header: '到期日',
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string | null
      if (!dueDate) return 'N/A'
      return new Date(dueDate).toLocaleDateString()
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const todo = row.original
      if (!todo.completed) {
        return (
          <Button variant="ghost" size="sm" onClick={() => onConfirm(todo.id)}>
            確認
          </Button>
        )
      }
      return null
    }
  }
]
