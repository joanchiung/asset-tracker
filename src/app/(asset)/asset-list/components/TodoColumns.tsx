'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Todo } from '@/constant/api/todos/request-response.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// 這裡我們假設 onEdit 函數將接收一個 Todo 物件，並處理彈窗邏輯
interface ColumnsProps {
  onConfirm: (todoId: number) => void
  onEdit: (todo: Todo) => void // 新增 onEdit 屬性
  onDelete: (todoId: number) => void // 新增 onDelete 屬性
}

const priorityMap: Record<Todo['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500'
}

interface ColumnsProps {
  onConfirm: (id: number) => void
}

export const columns = ({ onConfirm, onEdit, onDelete }: ColumnsProps): ColumnDef<Todo>[] => [
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
    enableHiding: false,
    cell: ({ row }) => {
      const todo = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(todo)}>編輯</DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onDelete(todo.id)}>刪除</DropdownMenuItem>
             */}
            <DropdownMenuItem
              onClick={() => {
                // 通常會先有個確認彈窗
                if (window.confirm('確定要刪除這筆待辦事項嗎？')) {
                  onDelete(todo.id)
                }
              }}
              className="text-red-600" // 可以給刪除按鈕一些紅色提示
            >
              刪除
            </DropdownMenuItem>

            {/* 也可以在這裡添加快速完成/未完成的選項 */}
            {!todo.completed && (
              <DropdownMenuItem onClick={() => onConfirm(todo.id)}>標記為完成</DropdownMenuItem>
            )}
            {todo.completed && (
              <DropdownMenuItem onClick={() => onEdit({ ...todo, completed: false })}>
                標記為未完成
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
