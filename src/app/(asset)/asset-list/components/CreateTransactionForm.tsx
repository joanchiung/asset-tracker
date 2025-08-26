import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Todo } from '@/constant/api/todos/request-response.types'
import { Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  AlertCircle,
  Coins,
  Briefcase,
  Hammer,
  TrendingUpIcon,
  Home,
  ShoppingCart,
  BookOpen,
  Heart,
  Plane,
  Car,
  Flame,
  Zap,
  Moon
} from 'lucide-react'
import { useCurrencies } from '@/hooks/useCurrencies'
import { cryptoCurrenciesData } from '@/data/currencies'

const getAllCurrencies = (majorFiatCodes: string[]) => [
  ...majorFiatCodes,
  ...cryptoCurrenciesData.map((crypto) => crypto.symbol)
]

const formSchema = (currencies: string[]) =>
  z.object({
    title: z.string().min(1, '請輸入標題'),
    amount: z.number().min(0.01, '金額必須大於 0'),
    currency: z.enum(currencies as [string, ...string[]]),
    mainType: z.enum(['income', 'expense']),
    subType: z.string().min(1, '請選擇子類型'),
    priority: z.enum(['high', 'medium', 'low']),
    transactionDate: z.string().min(1, '請選擇日期')
  })

interface Props {
  onCreate: (transactionData: {
    title: string
    description?: string
    priority?: Todo['priority']
    category?: string
    dueDate?: string
  }) => void
  loading: boolean
}

const typeOptions = {
  income: [
    {
      value: '配息',
      label: '配息',
      desc: '股票、基金配息收入',
      icon: Coins
    },
    {
      value: '本業收入',
      label: '本業收入',
      desc: '薪資、獎金等',
      icon: Briefcase
    },
    {
      value: '接案收入',
      label: '接案收入',
      desc: '自由接案、兼職收入',
      icon: Hammer
    },
    {
      value: '投資收益',
      label: '投資收益',
      desc: '股票、加密貨幣收益',
      icon: TrendingUpIcon
    }
  ],
  expense: [
    {
      value: '貸款',
      label: '貸款',
      desc: '房貸、車貸等',
      icon: Home
    },
    {
      value: '日常生活費',
      label: '日常生活費',
      desc: '食物、用品等',
      icon: ShoppingCart
    },
    {
      value: '學習資金',
      label: '學習資金',
      desc: '課程、書籍等',
      icon: BookOpen
    },
    {
      value: '醫療保險',
      label: '醫療保險',
      desc: '醫療費用、保險費',
      icon: Heart
    },
    {
      value: '旅遊',
      label: '旅遊',
      desc: '旅行、娛樂支出',
      icon: Plane
    },
    {
      value: '交通費',
      label: '交通費',
      desc: '油費、大眾運輸等',
      icon: Car
    }
  ]
}

export default function CreateTransactionForm({ onCreate, loading }: Props) {
  const { currencies } = useCurrencies()
  const majorFiatCodes = currencies.fiat.map((fiat) => fiat.code)

  const allCurrencies = getAllCurrencies(majorFiatCodes)

  const currentFormSchema = formSchema(allCurrencies)
  type FormData = z.infer<typeof currentFormSchema>

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: {
      priority: 'medium',
      mainType: 'income',
      currency: 'TWD',
      subType: '',
      transactionDate: new Date().toISOString().split('T')[0]
    }
  })

  const watchedMainType = watch('mainType')
  const watchedAmount = watch('amount')
  const watchedCurrency = watch('currency')

  const onSubmit = (data: FormData) => {
    const transactionData = {
      title: data.title,
      description: `${data.mainType === 'income' ? '收入' : '支出'}: ${data.amount} ${
        data.currency
      }`,
      priority: data.priority,
      category: data.subType,
      dueDate: data.transactionDate
    }

    onCreate(transactionData)
    reset({
      ...data,
      title: '',
      amount: 0,
      subType: '',
      transactionDate: new Date().toISOString().split('T')[0]
    })
  }

  const priorityConfig = {
    high: {
      label: '重要',
      color: 'border-red-500 bg-red-50 text-red-700',
      icon: Flame
    },
    medium: {
      label: '中等',
      color: 'border-yellow-500 bg-yellow-50 text-yellow-700',
      icon: Zap
    },
    low: {
      label: '一般',
      color: 'border-green-500 bg-green-50 text-green-700',
      icon: Moon
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          {/* <DollarSign className="h-5 w-5" /> */}
          新增交易記錄
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              交易類型 <span className="text-red-500">*</span>
            </label>

            <Controller
              name="mainType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange('income')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      field.value === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">收入</div>
                    <div className="text-xs text-gray-500">錢進來了</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange('expense')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      field.value === 'expense'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TrendingDown className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">支出</div>
                    <div className="text-xs text-gray-500">錢花出去了</div>
                  </button>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              標題 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('title')}
              placeholder="簡短描述這筆交易，例如：ETH 質押利息"
              className="text-base"
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              金額與幣種 <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="text-lg font-mono"
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
                )}
              </div>

              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                        法幣
                      </div>
                      {majorFiatCodes.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}

                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                        加密貨幣
                      </div>
                      {cryptoCurrenciesData.map((crypto) => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol}>
                          {crypto.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              {watchedMainType === 'income' ? '收入' : '支出'}類別{' '}
              <span className="text-red-500">*</span>
            </label>

            <Controller
              name="subType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {typeOptions[watchedMainType].map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          field.value === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.subType && <p className="text-sm text-red-600">{errors.subType.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                優先級
              </label>

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row gap-2">
                    {Object.entries(priorityConfig).map(([value, config]) => {
                      const IconComponent = config.icon
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={`w-full p-2 text-left rounded-lg border transition-all ${
                            field.value === value
                              ? config.color
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{config.label}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                交易日期 <span className="text-red-500">*</span>
              </label>
              <Input {...register('transactionDate')} type="date" />
              {errors.transactionDate && (
                <p className="text-sm text-red-600">{errors.transactionDate.message}</p>
              )}
            </div>
          </div>

          {watchedAmount > 0 && (
            <div className="bg-gray-100  rounded-lg p-6">
              <div className="flex items-center gap-2 text-sm">
                <Badge
                  variant={watchedMainType === 'income' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {watchedMainType === 'income' ? '收入' : '支出'}
                </Badge>

                <span className="text-gray-600">
                  {watch('transactionDate') &&
                    new Date(watch('transactionDate')).toLocaleDateString('zh-TW')}
                </span>

                <span className="text-gray-800 font-medium">{watch('title') || ' '}</span>

                <span className="text-lg font-mono font-bold  ">
                  {watchedAmount} {watchedCurrency}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button type="submit" disabled={loading} className="w-full py-3 text-base font-medium">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  新增中...
                </>
              ) : (
                <>✨ 新增交易記錄</>
              )}
            </Button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-blue-800 mb-2">💡 小提示</h4>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• 先選擇是收入還是支出，系統會顯示對應的類別選項</li>
              <li>• 金額支援小數點，加密貨幣建議輸入完整數量</li>
              <li>• 優先級會影響待辦事項的排序和顯示</li>
              <li>• 完成待辦事項時，金額會自動加入資產組合</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
