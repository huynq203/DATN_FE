import React from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'
interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions
  autoComplete?: string
}

export default function Input({
  className,
  type,
  placeholder,
  register,
  name,
  rules,
  errorMessage,
  autoComplete
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-2xl'
        placeholder={placeholder}
        {...register(name, rules)}
        autoComplete={autoComplete}
      />
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
