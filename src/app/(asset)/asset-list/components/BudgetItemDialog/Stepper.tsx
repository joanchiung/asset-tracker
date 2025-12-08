import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepperProps {
  currentStep: number
}

const steps = [
  {
    title: '選擇類型',
    description: '這是收入還是支出？選擇對應的類別'
  },
  {
    title: '填寫詳情',
    description: '輸入標題、金額和日期'
  },
  {
    title: '最後一步',
    description: '檢查資訊是否正確'
  }
]

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full px-4">
      <div className="flex items-start justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 -z-10 mx-[10%]">
          <div className="w-full h-full bg-gray-200 relative">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative z-10 bg-white mb-2',
                  'shadow-sm border-2',
                  isCompleted && 'bg-blue-500 text-white border-blue-500',
                  isCurrent && 'bg-blue-500 text-white border-blue-500 scale-110 shadow-md',
                  !isCompleted && !isCurrent && 'bg-white text-gray-400 border-gray-300'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
              </div>

              <div className="text-center mt-3 px-2">
                <h3 className="text-sm font-semibold transition-colors duration-300 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-xs mt-1 transition-colors duration-300 text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
