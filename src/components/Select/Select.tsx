import React, { SelectHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'
interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  classNameInput?: string
  classNameError?: string
  errorMessage?: string
  placeholder?: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions
}
export default function Select({
  className,
  register,
  name,
  rules,
  errorMessage,
  autoComplete,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div>
      <div className={className}>
        <select className={classNameInput} {...registerResult} {...rest} autoComplete={autoComplete}>
          {rest.children}
        </select>
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </div>
  )
}
