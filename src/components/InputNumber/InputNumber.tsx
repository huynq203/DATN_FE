import { forwardRef, InputHTMLAttributes } from 'react'
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
  errorMessage?: string
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    className,
    errorMessage,
    autoComplete,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-2xl',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} ref={ref} onChange={handleChange} autoComplete={autoComplete} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
