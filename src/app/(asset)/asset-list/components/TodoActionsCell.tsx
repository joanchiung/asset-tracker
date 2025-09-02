import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import { Todo, UpdateTodoRequest } from '@/constant/api/todos/request-response.types'

interface UpdateTodoPayload {
  id: number
  data: UpdateTodoRequest
}

interface TodoActionsCellProps {
  todo: Todo
  onEditTodo: (todo: Todo) => void
  token: string
}

export const TodoActionsCell: React.FC<TodoActionsCellProps> = ({ todo, onEditTodo, token }) => {
  const queryClient = useQueryClient()

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      return await fetchFunc({
        key: 'DeleteTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        routeParams: new URLSearchParams({ id: todoId.toString() })
      })
    },
    onSuccess: () => {
      toast.success('待辦事項已刪除')
      queryClient.invalidateQueries({ queryKey: ['GetTodos'] })
      queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] })
    },
    onError: (error) => {
      toast.error('刪除失敗', { description: error.message || '請稍後再試' })
    }
  })

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: UpdateTodoPayload) => {
      const searchParams = new URLSearchParams()
      searchParams.append('id', id.toString())
      return fetchFunc({
        key: 'UpdateTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        routeParams: searchParams,
        request: data
      })
    },
    onSuccess: () => {
      toast.success('待辦事項已更新')
      queryClient.invalidateQueries({ queryKey: ['GetTodos'] })
      queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] })
    },
    onError: (error) => {
      toast.error('確認失敗', { description: error.message || '請稍後再試' })
    }
  })

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
        <DropdownMenuItem onClick={() => onEditTodo(todo)}>編輯</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (window.confirm('確定要刪除這筆待辦事項嗎？')) {
              deleteTodoMutation.mutate(todo.id)
            }
          }}
          className="text-red-600"
        >
          刪除
        </DropdownMenuItem>
        {!todo.completed && (
          <DropdownMenuItem
            onClick={() => updateTodoMutation.mutate({ id: todo.id, data: { completed: true } })}
          >
            標記為完成
          </DropdownMenuItem>
        )}
        {todo.completed && (
          <DropdownMenuItem
            onClick={() => updateTodoMutation.mutate({ id: todo.id, data: { completed: false } })}
          >
            標記為未完成
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
