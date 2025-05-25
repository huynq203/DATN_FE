import { forwardRef, InputHTMLAttributes, useState } from 'react'
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
  errorMessage?: string
}

const InputV2 = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    className,
    errorMessage,
    autoComplete,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-2xl',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      //Thực thi onchange callback từ bên ngoài vào props
      onChange && onChange(event)
      //Cập nhật giá trị localValue
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        {...rest}
        ref={ref}
        value={value || localValue}
        onChange={handleChange}
        autoComplete={autoComplete}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputV2


