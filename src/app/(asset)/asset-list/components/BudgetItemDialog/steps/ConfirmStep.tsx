'use client'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { TransactionFormData } from '../schema/BudgetFormSchema'
import { PrioritySelect } from '../select/PrioritySelect'
import { cn } from '@/lib/utils'

interface ConfirmStepProps {
  control: Control<TransactionFormData>
  errors: FieldErrors<TransactionFormData>
  formData: TransactionFormData
}

export function ConfirmStep({ control, errors, formData }: ConfirmStepProps) {
  return (
    <div className="space-y-6">
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <PrioritySelect
            value={field.value}
            onChange={field.onChange}
            error={errors.priority?.message}
          />
        )}
      />

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-4">預覽</h4>

        <div className="space-y-4">
          <div className="space-y-2">
            {formData.title && (
              <div className="text-xl font-semibold text-gray-900">{formData.title}</div>
            )}

            {formData.amount && (
              <div
                className={cn(
                  'text-3xl font-bold font-mono',
                  formData.mainType === 'income' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {formData.mainType === 'expense' && '-'}
                {formData.amount}
                <span className="text-lg text-gray-500 ml-1 font-normal">{formData.currency}</span>
              </div>
            )}
          </div>

          {(formData.title || formData.amount) && <div className="border-t border-gray-100" />}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 min-w-12">類別</span>
              <Badge
                variant={formData.mainType === 'income' ? 'default' : 'destructive'}
                className="text-xs font-medium"
              >
                {formData.mainType === 'income' ? '收入' : '支出'}
              </Badge>
              {formData.subType && (
                <Badge variant="outline" className="text-xs">
                  {formData.subType}
                </Badge>
              )}
            </div>

            {formData.transactionDate && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 min-w-12">日期</span>
                <span className="text-sm text-gray-700">
                  {new Date(formData.transactionDate).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}

            {formData.priority && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 min-w-12">優先級</span>
                <Badge variant="secondary" className="text-xs">
                  {formData.priority}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
          <span>⚠️</span>
          <span>確認提示</span>
        </h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• 請仔細檢查金額和幣種是否正確</li>
          <li>• 交易記錄提交後可以在列表中管理</li>
        </ul>
      </div>
    </div>
  )
}
