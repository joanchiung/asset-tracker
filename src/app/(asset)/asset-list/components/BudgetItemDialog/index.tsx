'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, DollarSign } from 'lucide-react'
import { useCurrencies } from '@/hooks/useCurrencies'
import { useSession } from 'next-auth/react'
import { fetchFunc } from '@/lib/axios'
import { cryptoCurrenciesData } from '@/data/currencies'
import { createBudgetFormSchema, TransactionFormData } from './schema/BudgetFormSchema'
import { TypeCategoryStep } from './steps/TypeCategoryStep'
import { DetailsStep } from './steps/DetailsStep'
import { ConfirmStep } from './steps/ConfirmStep'
import { StepNavigation } from './StepNavigation'
import { Stepper } from './Stepper'

const getAllCurrencies = (majorFiatCodes: string[]) => [
  ...majorFiatCodes,
  ...cryptoCurrenciesData.map((crypto) => crypto.symbol)
]

export default function BudgetItemDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.accessToken as string
  const { currencies } = useCurrencies()

  const majorFiatCodes = currencies.fiat.map((fiat) => fiat.code)
  const allCurrencies = getAllCurrencies(majorFiatCodes)
  const currentFormSchema = createBudgetFormSchema(allCurrencies)

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
        headers: { Authorization: `Bearer ${token}` },
        request: todoData
      })
    },
    onSuccess: () => {
      toast.success('預算項目已建立')
      queryClient.invalidateQueries({ queryKey: ['GetTodos'] })
      queryClient.invalidateQueries({ queryKey: ['GetTodoCategories'] })
      handleCloseDialog(false)
    },
    onError: (error: Error) => {
      toast.error('建立失敗', { description: error.message || '請稍後再試' })
    }
  })

  const {
    handleSubmit,
    reset,
    watch,
    control,
    register,

    trigger,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(currentFormSchema),
    mode: 'onChange',
    defaultValues: {
      priority: 'medium',
      mainType: 'income',
      currency: 'TWD',
      subType: '',
      transactionDate: new Date().toISOString().split('T')[0],
      title: '',
      amount: ''
    }
  })

  const formData = watch()

  const onSubmit = (data: TransactionFormData) => {
    const budgetData = {
      title: data.title,
      description: `${data.mainType === 'income' ? '收入' : '支出'}: ${data.amount} ${
        data.currency
      }`,
      priority: data.priority,
      category: data.subType,
      dueDate: data.transactionDate
    }
    createTodoMutation.mutate(budgetData)
  }

  const handleCloseDialog = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      reset()
      setCurrentStep(0)
    }
  }

  const handleNext = async () => {
    let isStepValid = false

    switch (currentStep) {
      case 0:
        isStepValid = await trigger(['mainType', 'subType'])
        break
      case 1:
        isStepValid = await trigger(['title', 'amount', 'currency', 'transactionDate'])
        break
      default:
        isStepValid = true
    }

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2))
    } else {
      console.log('❌ 表單驗證失敗', errors)
    }
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        <span>新增預算項目</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="h-5 w-5" />
              新增預算項目
            </DialogTitle>
          </DialogHeader>

          <Stepper currentStep={currentStep} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 mb-6 w-full bg-gray-100 rounded-md">
              {currentStep === 0 && (
                <TypeCategoryStep control={control} errors={errors} mainType={formData.mainType} />
              )}

              {currentStep === 1 && (
                <DetailsStep
                  control={control}
                  register={register}
                  errors={errors}
                  formData={formData}
                />
              )}

              {currentStep === 2 && (
                <ConfirmStep control={control} errors={errors} formData={formData} />
              )}
            </div>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={3}
              onNext={handleNext}
              onBack={handleBack}
              canProceed={true}
              loading={createTodoMutation.isPending}
              submitLabel="確認新增"
            />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
