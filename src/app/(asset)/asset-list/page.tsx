'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import AssetSummary from './components/AssetSummary'
import { getTodoColumns } from './components/TodoColumns'
import { DataTable } from './components/DataTable'
import { GetTodosParams, UpdateTodoRequest } from '@/constant/api/todos/request-response.types'
import { OnChangeFn, SortingState } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Todo } from '@/constant/api/todos/request-response.types'
import { EditTodoDialog } from './components/EditTodoDialog'
import { Button } from '@/components/ui/button'
import { FilterConfig } from './components/dataTable/types'
import BudgetItemDialog from './components/BudgetItemDialog'

const VALID_SORT_FIELDS = ['created_at', 'updated_at', 'due_date', 'priority', 'title'] as const
type ValidSortField = (typeof VALID_SORT_FIELDS)[number]

interface UpdateTodoPayload {
  id: number
  data: UpdateTodoRequest
}

export default function AssetListPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const queryClient = useQueryClient()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [queryParams, setQueryParams] = useState<GetTodosParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  const { data: { transactions = [], pagination } = {} } = useQuery({
    queryKey: ['GetTodos', queryParams],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodos',
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    select: (data) => ({
      transactions: data?.data?.todos || [],
      pagination: data?.data?.pagination
    })
  })

  const totalCounts = pagination?.totalItems ?? 0

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

  const handleSaveEditedTodo = useCallback(
    (updatedTodo: Todo) => {
      updateTodoMutation.mutate(
        {
          id: updatedTodo.id,
          data: {
            title: updatedTodo.title,
            description: updatedTodo.description,
            priority: updatedTodo.priority,
            category: updatedTodo.category,
            dueDate: updatedTodo.dueDate,
            completed: updatedTodo.completed
          }
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false)
            setEditingTodo(null)
          }
        }
      )
    },
    [updateTodoMutation]
  )

  const { data: todoCategories } = useQuery({
    queryKey: ['GetTodoCategories'],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodoCategories',
        headers: { Authorization: `Bearer ${token}` }
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 60,
    select: (data) => data.data?.categories
  })

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsEditDialogOpen(true)
  }

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updaterOrValue) => {
      const currentSorting = [
        {
          id: queryParams.sortBy || 'created_at',
          desc: queryParams.sortOrder === 'desc'
        }
      ]
      const newSortingState =
        typeof updaterOrValue === 'function' ? updaterOrValue(currentSorting) : updaterOrValue

      if (newSortingState.length > 0) {
        const { id, desc } = newSortingState[0]

        if (VALID_SORT_FIELDS.includes(id as ValidSortField)) {
          setQueryParams((prev) => ({
            ...prev,
            sortBy: id as ValidSortField,
            sortOrder: desc ? 'desc' : 'asc',
            page: 1
          }))
        }
      } else {
        setQueryParams((prev) => ({
          ...prev,
          sortBy: 'created_at',
          sortOrder: 'desc',
          page: 1
        }))
      }
    },
    [queryParams, setQueryParams]
  )

  const todoColumns = getTodoColumns(handleEditTodo, token)

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
      queryClient.invalidateQueries({
        queryKey: ['GetTodos', queryParams]
      })
      queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] })
      queryClient.invalidateQueries({ queryKey: ['GetTodoCategories'] })
    },
    onError: (error) => {
      toast.error('刪除失敗', { description: error.message || '請稍後再試' })
    }
  })

  const handleBatchDelete = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) return

    try {
      await Promise.all(selectedIds.map((id) => deleteTodoMutation.mutateAsync(id)))

      setRowSelection({})

      toast.success(`成功刪除 ${selectedIds.length} 個待辦事項`)
    } catch {
      toast.error('批量刪除失敗', {
        description: '部分項目可能刪除失敗，請重試'
      })
    }
  }

  const filters: FilterConfig[] = [
    {
      key: 'category',
      label: '分類',
      type: 'multiSelect',
      options: (todoCategories || [])
        .filter((cat) => !!cat.name?.trim())
        .map((cat) => ({
          label: cat.name.trim(),
          value: cat.name.trim(),
          count: cat.count
        })),

      placeholder: '選擇分類',
      width: 'w-48',
      targetType: 'string'
    },
    {
      key: 'priority',
      label: '優先度',
      type: 'select',
      options: [
        { label: '高優先度', value: 'high' },
        { label: '中優先度', value: 'medium' },
        { label: '低優先度', value: 'low' }
      ],
      placeholder: '選擇優先度',
      width: 'w-36',
      targetType: 'string'
    },
    {
      key: 'completed',
      label: '完成狀態',
      type: 'select',
      options: [
        { label: '已完成', value: true },
        { label: '待完成', value: false }
      ],
      placeholder: '選擇狀態',
      width: 'w-32',
      targetType: 'boolean'
    }
  ]

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <AssetSummary />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <Card className="w-full lg:flex-1 max-w-full">
          <CardHeader className="flex flex-row gap-2 justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">資產排程表</CardTitle>
            <BudgetItemDialog />
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-2 sm:px-6 w-full">
            <DataTable
              columns={todoColumns}
              data={transactions}
              totalCounts={totalCounts}
              search={{
                placeholder: '搜尋標題、描述、優先度或分類...'
              }}
              pagination={{
                state: {
                  pageIndex: (queryParams.page || 1) - 1,
                  pageSize: queryParams.limit || 10
                },
                onChange: (updater) => {
                  setQueryParams((prev) => {
                    const currentPagination = {
                      pageIndex: (prev.page || 1) - 1,
                      pageSize: prev.limit || 10
                    }

                    const newPagination =
                      typeof updater === 'function' ? updater(currentPagination) : updater

                    return {
                      ...prev,
                      page: newPagination.pageIndex + 1,
                      limit: newPagination.pageSize
                    }
                  })
                },
                pageCount: pagination?.totalPages || 1,
                show: true
              }}
              toolbar={(table) => (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={Object.keys(table.getState().rowSelection).length === 0}
                    onClick={() => {
                      const selectedRows = table.getFilteredSelectedRowModel().rows
                      const selectedIds = selectedRows.map((row) => row.original.id)
                      handleBatchDelete(selectedIds)
                    }}
                  >
                    刪除選中項目 ({Object.keys(table.getState().rowSelection).length})
                  </Button>
                </div>
              )}
              sorting={{
                state: [
                  {
                    id: queryParams.sortBy || 'id',
                    desc: queryParams.sortOrder === 'desc'
                  }
                ],
                onChange: handleSortingChange
              }}
              rowSelection={{
                state: rowSelection,
                onChange: setRowSelection
              }}
              filters={{
                config: filters
              }}
            />
          </CardContent>
        </Card>

        <EditTodoDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingTodo(null)
          }}
          todo={editingTodo}
          onSave={handleSaveEditedTodo}
          isLoading={updateTodoMutation.isPending}
          availableCategories={todoCategories?.map((cat) => cat.name) || []}
        />
      </div>
    </div>
  )
}
