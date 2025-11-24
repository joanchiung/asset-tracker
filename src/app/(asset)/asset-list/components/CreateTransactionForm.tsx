'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Plus, DollarSign } from 'lucide-react'
import { useCurrencies } from '@/hooks/useCurrencies'
import { cryptoCurrenciesData } from '@/data/currencies'
import { Todo } from '@/constant/api/todos/request-response.types'
import {
  createTransactionFormSchema,
  getDefaultFormValues,
  type TransactionFormData
} from './schema/TransactionFormSchema'
import { type MainTransactionType } from './constants/TransactionConfig'
import { MainTypeSelector } from './selector/Maintypeselector'
import { PrioritySelector } from './selector/Priorityselector'
import { SubTypeSelector } from './selector/Subtypeselector'
import { CurrencyAmountInput } from './input/Currencyamountinput'

const getAllCurrencies = (majorFiatCodes: string[]) => [
  ...majorFiatCodes,
  ...cryptoCurrenciesData.map((crypto) => crypto.symbol)
]

interface CreateTransactionFormProps {
  onCreate: (transactionData: {
    title: string
    description?: string
    priority?: Todo['priority']
    category?: string
    dueDate?: string
  }) => void
  loading: boolean
  availableCategories: string[]
}

export default function CreateTransactionForm({ onCreate, loading }: CreateTransactionFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { currencies } = useCurrencies()
  const majorFiatCodes = currencies.fiat.map((fiat) => fiat.code)
  const allCurrencies = getAllCurrencies(majorFiatCodes)

  const currentFormSchema = createTransactionFormSchema(allCurrencies)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: getDefaultFormValues()
  })

  const watchedMainType = watch('mainType') as MainTransactionType
  const watchedAmount = watch('amount')
  const watchedCurrency = watch('currency')
  const watchedTitle = watch('title')
  const watchedTransactionDate = watch('transactionDate')

  const onSubmit = (data: TransactionFormData) => {
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
    setIsDialogOpen(false)
    reset(getDefaultFormValues())
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      reset(getDefaultFormValues())
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={handleOpenDialog}>
        <Plus className="h-4 w-4 mr-2" />
        <span>新增預算項目</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="h-5 w-5" />
              新增預算項目
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <MainTypeSelector control={control} error={errors.mainType} />

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

            <CurrencyAmountInput
              register={register}
              control={control}
              majorFiatCodes={majorFiatCodes}
              amountError={errors.amount}
              currencyError={errors.currency}
            />

            <SubTypeSelector control={control} mainType={watchedMainType} error={errors.subType} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PrioritySelector control={control} error={errors.priority} />

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

            {watchedAmount && watchedAmount > 0 && (
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <Badge
                    variant={watchedMainType === 'income' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {watchedMainType === 'income' ? '收入' : '支出'}
                  </Badge>

                  {watchedTransactionDate && (
                    <span className="text-gray-600">
                      {new Date(watchedTransactionDate).toLocaleDateString('zh-TW')}
                    </span>
                  )}

                  {watchedTitle && (
                    <span className="text-gray-800 font-medium">{watchedTitle}</span>
                  )}

                  <span className="text-lg font-mono font-bold">
                    {watchedAmount} {watchedCurrency}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 text-base font-medium"
              >
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
              </ul>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
