'use client'

import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import CreateTransactionForm from './components/CreateTransactionForm'
import AssetSummary from './components/AssetSummary'
import { getTodoColumns } from './components/TodoColumns'
import { DataTable } from './components/DataTable'
import { GetTodosParams, UpdateTodoRequest } from '@/constant/api/todos/request-response.types'
import { OnChangeFn, SortingState, PaginationState } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Todo } from '@/constant/api/todos/request-response.types'
import { EditTodoDialog } from './components/EditTodoDialog'
import { Button } from '@/components/ui/button'
import { FilterConfig } from './components/DataTable'

interface UpdateTodoPayload {
  id: number
  data: UpdateTodoRequest
}

export default function AssetListPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const queryClient = useQueryClient()
  const [displayCurrency, setDisplayCurrency] = useState<'TWD' | 'USD'>('TWD')

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [filtersValue, setFiltersValue] = useState<Record<string, string>>({})

  const [queryParams, setQueryParams] = useState<GetTodosParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const VALID_SORT_FIELDS = ['created_at', 'updated_at', 'due_date', 'priority', 'title'] as const
  type ValidSortField = (typeof VALID_SORT_FIELDS)[number]

  // 獲取資產總覽
  const { data: assetsDatas } = useQuery({
    queryKey: ['GetAssetSummary'],
    queryFn: () =>
      fetchFunc({
        key: 'GetAssetSummary',
        headers: { Authorization: `Bearer ${token}` }
      }),
    enabled: !!token,
    select: (data) => data.data?.assets
  })

  // 獲取匯率
  const { data: exchangeRates } = useQuery({
    queryKey: ['GetExchangeRates', displayCurrency],
    queryFn: () =>
      fetchFunc({
        key: 'GetExchangeRates',
        params: { baseCurrency: displayCurrency }
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 15,
    select: (data) => data.data?.rates
  })

  // 獲取交易紀錄
  const { data: todosResponse } = useQuery({
    queryKey: ['GetTodos', queryParams],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodos',
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5
  })

  const transactions = todosResponse?.data?.todos || []
  const pagination = todosResponse?.data?.pagination

  // 更新待辦事項 mutation
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

  // 處理編輯彈窗的儲存動作
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
            setEditingTodo(null) // 清空編輯中的 todo
          }
        }
      )
    },
    [updateTodoMutation]
  )

  // 創建待處理交易
  const createTodoMutation = useMutation({
    mutationFn: async (todoData: {
      title: string
      description?: string
      priority?: 'low' | 'medium' | 'high'
      category?: string
      dueDate?: string
    }) => {
      return await fetchFunc({
        key: 'CreateTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        request: todoData
      })
    },
    onSuccess: () => {
      toast.success('待處理紀錄已建立')
      queryClient.invalidateQueries({
        queryKey: ['GetTodos', queryParams]
      })
      queryClient.invalidateQueries({ queryKey: ['GetTodoCategories'] })
    },
    onError: (error) => {
      toast.error('建立失敗', { description: error.message || '請稍後再試' })
    }
  })

  // 獲取待辦事項分類
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

  // 計算總資產
  const totalValue = (() => {
    if (!assetsDatas?.length || !exchangeRates || Object.keys(exchangeRates).length === 0) {
      return 0
    }

    return assetsDatas.reduce((total, assetsData) => {
      const rate = exchangeRates[assetsData.currency.toUpperCase()] || 0
      const amount = parseFloat(assetsData.balance) || 0
      return total + amount * rate
    }, 0)
  })()

  // 處理編輯按鈕點擊
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsEditDialogOpen(true)
  }

  // 處理排序變更 (簡化)
  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const currentSorting = [
        {
          id: queryParams.sortBy || 'created_at',
          desc: queryParams.sortOrder === 'desc'
        }
      ]

      const newSortingState = typeof updater === 'function' ? updater(currentSorting) : updater

      const updateSortParams = (sortBy: ValidSortField, sortOrder: 'asc' | 'desc') => {
        setQueryParams((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }))
      }

      if (newSortingState.length > 0) {
        const { id, desc } = newSortingState[0]
        if (VALID_SORT_FIELDS.includes(id as ValidSortField)) {
          updateSortParams(id as ValidSortField, desc ? 'desc' : 'asc')
        }
      } else {
        updateSortParams('created_at', 'desc')
      }
    },
    [VALID_SORT_FIELDS, queryParams.sortBy, queryParams.sortOrder]
  )

  // 處理分頁變更 (簡化)
  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const newPaginationState =
        typeof updater === 'function'
          ? updater({
              pageIndex: (queryParams.page || 1) - 1,
              pageSize: queryParams.limit || 10
            })
          : updater

      setQueryParams((prev) => ({
        ...prev,
        page: newPaginationState.pageIndex + 1,
        limit: newPaginationState.pageSize
      }))
    },
    [queryParams]
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

  // 批量刪除處理函數
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
      width: 'w-48'
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
      width: 'w-36'
    },
    {
      key: 'completed',
      label: '完成狀態',
      type: 'select',
      options: [
        { label: '已完成', value: 'true' },
        { label: '待完成', value: 'false' }
      ],
      placeholder: '選擇狀態',
      width: 'w-32'
    }
  ]

  const filteredTransactions = (() => {
    let result = [...transactions]

    if (searchValue.trim()) {
      const searchFields: (keyof Todo)[] = ['title', 'description', 'priority', 'category']

      result = result.filter((todo) =>
        searchFields.some((field) =>
          String(todo[field] || '')
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
      )
    }

    Object.entries(filtersValue).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'completed') {
          result = result.filter((todo) => String(todo.completed) === String(value))
        } else {
          const todoKey = key as keyof Todo
          result = result.filter((todo) => String(todo[todoKey]) === String(value))
        }
      }
    })

    return result
  })()

  return (
    <div className="space-y-8 p-4 md:p-6">
      <AssetSummary
        assets={assetsDatas ?? []}
        totalValue={totalValue}
        displayCurrency={displayCurrency}
        onCurrencyChange={setDisplayCurrency}
        exchangeRates={exchangeRates}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <Card className="w-full lg:flex-1 max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">資產排程表</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-2 sm:px-6 w-full bg-indigo-200/0">
            <div className="w-full flex items-center justify-between">
              <h6 className="font-medium">預算項目列表</h6>
              <CreateTransactionForm
                onCreate={createTodoMutation.mutate}
                loading={createTodoMutation.isPending}
                availableCategories={todoCategories?.map((cat) => cat.name) || []}
              />
            </div>
            <div className="overflow-x-auto ">
              <DataTable
                columns={todoColumns}
                data={filteredTransactions}
                search={{
                  value: searchValue,
                  onChange: handleSearchChange,
                  placeholder: '搜尋標題、描述、優先度或分類...'
                }}
                pagination={{
                  state: {
                    pageIndex: (queryParams.page || 1) - 1,
                    pageSize: queryParams.limit || 10
                  },
                  onChange: handlePaginationChange,
                  pageCount: pagination?.totalPages || 1,
                  show: true
                }}
                sorting={{
                  state: [
                    {
                      id: queryParams.sortBy || 'id',
                      desc: queryParams.sortOrder === 'desc'
                    }
                  ],
                  onChange: handleSortingChange
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
                rowSelection={{
                  state: rowSelection,
                  onChange: setRowSelection
                }}
                filters={{
                  config: filters,
                  value: filtersValue,
                  onChange: setFiltersValue
                }}
              />
            </div>
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
