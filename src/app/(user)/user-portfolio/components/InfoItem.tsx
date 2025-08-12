import React from 'react'
import { UseFormRegister, Path } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { UpdateUserFormData } from '@/lib/validations'

interface InfoItemData {
  key: keyof UpdateUserFormData | string
  icon: React.ReactNode
  label: string
  value?: string | number
  editable?: boolean
  className?: string
}

interface InfoItemProps {
  item: InfoItemData
  isEditing?: boolean
  register: UseFormRegister<UpdateUserFormData>
}

export const InfoItem = ({ item, isEditing, register }: InfoItemProps) => {
  if (isEditing && item.editable) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 text-gray-500 flex items-center justify-center">{item.icon}</div>
          <label htmlFor={item.key as string} className="text-sm font-medium">
            {item.label}
          </label>
        </div>
        <Input
          id={item.key as string}
          {...register(item.key as Path<UpdateUserFormData>)}
          placeholder={`輸入新的${item.label}`}
          className="h-8 w-48"
        />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 text-gray-500 flex items-center justify-center">{item.icon}</div>
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      <span className={`text-sm ${item.className || ''}`}>{item.value || '-'}</span>
    </div>
  )
}
