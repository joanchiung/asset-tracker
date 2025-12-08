'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

type StepNavigationProps = {
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onBack?: () => void
  canProceed?: boolean
  loading?: boolean
  submitLabel?: string
}

export function StepNavigation(props: StepNavigationProps) {
  const { currentStep, totalSteps, onNext, onBack, canProceed = true, loading = false } = props

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex gap-3 my-8 w-full">
      {!isFirstStep && (
        <Button type="button" onClick={onBack} variant="outline" className="flex-1 py-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          上一步
        </Button>
      )}

      {isLastStep ? (
        <Button
          type="submit"
          disabled={loading || !canProceed}
          className="flex-1 py-6 text-base font-medium"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              新增中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>確認新增</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onNext?.()
          }}
          disabled={!canProceed}
          className={`${isFirstStep ? 'w-full' : 'flex-1'} py-6 text-base`}
        >
          下一步
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
