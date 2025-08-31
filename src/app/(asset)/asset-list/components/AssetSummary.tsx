import { Asset, ExchangeRates } from '@/constant/api/asset/request-response.types'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { fetchFunc } from '@/lib/axios'
import { CalendarCog, AlarmClock, TriangleAlert } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AssetSummaryProps {
  assets: Asset[]
  totalValue: number
  displayCurrency: 'TWD' | 'USD'
  onCurrencyChange: (currency: 'TWD' | 'USD') => void
  exchangeRates?: ExchangeRates
}

export default function AssetSummary({
  assets,
  totalValue,
  displayCurrency,
  onCurrencyChange,
  exchangeRates
}: AssetSummaryProps) {
  const { data: session } = useSession()
  const token = session?.accessToken as string

  // 獲取待辦事項統計
  const { data: todoStats } = useQuery({
    queryKey: ['GetTodoStats'],
    queryFn: () =>
      fetchFunc({
        key: 'GetTodoStats',
        headers: { Authorization: `Bearer ${token}` }
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data?.stats
  })

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displayCurrency,
    maximumFractionDigits: 2
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500">總資產價值</h2>
          <p className="text-3xl font-bold text-gray-900">{formatter.format(totalValue)}</p>
        </div>
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => onCurrencyChange('TWD')}
            className={`px-3 py-1 text-sm rounded-md ${
              displayCurrency === 'TWD' ? 'bg-white shadow' : ''
            }`}
          >
            TWD
          </button>
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-3 py-1 text-sm rounded-md ${
              displayCurrency === 'USD' ? 'bg-white shadow' : ''
            }`}
          >
            USD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map((asset) => {
          const rate = exchangeRates?.[asset.currency.toUpperCase()]

          return (
            <div key={asset.currency} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="font-bold text-lg text-gray-800">{asset.currency.toUpperCase()}</p>
              <p className="text-gray-600">{(asset.amount || 0).toFixed(4)}</p>

              {rate != null ? (
                <p className="text-xs text-gray-500">≈ {formatter.format(asset.amount * rate)}</p>
              ) : (
                <p className="text-xs text-gray-500">-- (無匯率資料)</p>
              )}
            </div>
          )
        })}
        {assets.length === 0 && (
          <p className="text-gray-500 col-span-full">尚無資產，從新增一筆交易開始吧！</p>
        )}
      </div>

      {/* 待辦事項統計概覽 */}
      {todoStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總待辦事項</CardTitle>
              <CalendarCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoStats.total}</div>
              <p className="text-xs text-muted-foreground">已完成 {todoStats.completed} 筆</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完成率</CardTitle>
              <span className="text-muted-foreground">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoStats.completionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">目標 100%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日活動</CardTitle>
              <AlarmClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoStats.recentActivity.createdToday} 新增</div>
              <p className="text-xs text-muted-foreground">
                {todoStats.recentActivity.dueToday} 待辦, {todoStats.recentActivity.completedToday}{' '}
                完成
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">逾期</CardTitle>
              <TriangleAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{todoStats.overdue}</div>
              <p className="text-xs text-muted-foreground">需立即處理</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
