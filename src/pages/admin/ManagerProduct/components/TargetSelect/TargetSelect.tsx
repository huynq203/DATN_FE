import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}
export default function TargetSelect({ onChange, value, errorMessage }: Props) {
  const [valueTarget, setValueTarget] = useState(value)
  useEffect(() => {
    if (value) {
      setValueTarget(value)
    }
  }, [value])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target

    const newTarget = value
    setValueTarget(newTarget)
    onChange && onChange(newTarget)
  }
  return (
    <div>
      <select
        onChange={handleChange}
        value={valueTarget}
        className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm '
        name='category_id'
      >
        <option value='' disabled>
          Chọn đối tượng
        </option>
        <option value={0}>Trẻ em</option>
        <option value={1}>Người lớn</option>
      </select>
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
