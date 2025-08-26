'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { fetchFunc } from '@/lib/axios'
import CreateTransactionForm from './components/CreateTransactionForm'
import AssetSummary from './components/AssetSummary'
import { columns } from './components/TodoColumns'
import { DataTable } from './components/DataTable'
import { GetTodosParams } from '@/constant/api/todos/request-response.types'
import { OnChangeFn, SortingState } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AssetListPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const queryClient = useQueryClient()
  const [displayCurrency, setDisplayCurrency] = useState<'TWD' | 'USD'>('TWD')

  const [queryParams, setQueryParams] = useState<GetTodosParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

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

  // 完成一筆待處理紀錄
  const updateTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      return await fetchFunc({
        key: 'UpdateTodo',
        headers: {
          Authorization: `Bearer ${token}`
        },
        routeParams: new URLSearchParams({ id: todoId.toString() }),
        request: { completed: true }
      })
    },
    onSuccess: () => {
      toast.success('交易已確認，資產已更新')
      queryClient.invalidateQueries({ queryKey: ['GetTodos'] })
      queryClient.invalidateQueries({ queryKey: ['GetAssetSummary'] })
      queryClient.invalidateQueries({ queryKey: ['GetTransactions'] })
    },
    onError: (error) => {
      toast.error('確認失敗', { description: error.message || '請稍後再試' })
    }
  })

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
      queryClient.invalidateQueries({ queryKey: ['GetTransactions', { status: 'pending' }] })
    },
    onError: (error) => {
      toast.error('建立失敗', { description: error.message || '請稍後再試' })
    }
  })

  // 計算總資產
  const totalValue = useMemo(() => {
    if (!assetsDatas?.length || !exchangeRates || Object.keys(exchangeRates).length === 0) {
      return 0
    }

    return assetsDatas.reduce((total, assetsData) => {
      const rate = exchangeRates[assetsData.currency.toUpperCase()] || 0
      const amount = parseFloat(assetsData.balance) || 0
      return total + amount * rate
    }, 0)
  }, [assetsDatas, exchangeRates])

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (typeof updater !== 'function') {
      return
    }

    const currentSortState: SortingState = [
      {
        id: queryParams.sortBy || 'created_at',
        desc: queryParams.sortOrder === 'desc'
      }
    ]

    const [newSort] = updater(currentSortState)

    // 型別防護函式 (Type Guard)，用來檢查字串是否為有效的排序欄位
    const isValidField = (field: string): field is ValidSortField => {
      return VALID_SORT_FIELDS.includes(field as ValidSortField)
    }

    if (newSort && isValidField(newSort.id)) {
      // 【關鍵修正】
      // 在 if 判斷式內部，`newSort.id` 的型別已經被成功縮小為 `ValidSortField`。
      // 我們將這個被縮小了型別的值，賦予一個新的常數 `newSortBy`。
      const newSortBy = newSort.id

      // 現在，在 setQueryParams 的回呼函式中使用這個新的、型別安全的常數。
      setQueryParams((prev) => ({
        ...prev,
        sortBy: newSortBy, // 使用 newSortBy，它的型別是 `ValidSortField`，完全符合 GetTodosParams 的要求
        sortOrder: newSort.desc ? 'desc' : 'asc'
      }))
    }
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* 1. 資產總覽區 */}
      <AssetSummary
        assets={assetsDatas ?? []}
        totalValue={totalValue}
        displayCurrency={displayCurrency}
        onCurrencyChange={setDisplayCurrency}
        exchangeRates={exchangeRates}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* 2. 新增交易表單 */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <CreateTransactionForm
            onCreate={createTodoMutation.mutate}
            loading={createTodoMutation.isPending}
          />
        </div>

        {/* 3. 待處理與歷史紀錄列表 */}
        <Card className="w-full lg:flex-1 max-w-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">資產排程表</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="overflow-x-auto">
              <DataTable
                columns={columns({ onConfirm: updateTodoMutation.mutate })}
                data={transactions}
                pageCount={pagination?.totalPages || 1}
                pagination={{
                  pageIndex: (queryParams.page || 1) - 1,
                  pageSize: queryParams.limit || 10
                }}
                onPaginationChange={(updater) => {
                  if (typeof updater === 'function') {
                    const newPagination = updater({
                      pageIndex: (queryParams.page || 1) - 1,
                      pageSize: queryParams.limit || 10
                    })
                    setQueryParams((prev) => ({
                      ...prev,
                      page: newPagination.pageIndex + 1,
                      limit: newPagination.pageSize
                    }))
                  }
                }}
                sorting={[
                  {
                    id: queryParams.sortBy || 'id',
                    desc: queryParams.sortOrder === 'desc'
                  }
                ]}
                onSortingChange={handleSortingChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
