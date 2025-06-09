import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}
export default function GenderSelect({ onChange, value, errorMessage }: Props) {
  const [valueGender, setValueGender] = useState(value)
  useEffect(() => {
    if (value) {
      setValueGender(value)
    }
  }, [value])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    const newGender = value
    setValueGender(newGender)
    onChange && onChange(newGender)
  }
  return (
    <div>
      <select
        onChange={handleChange}
        value={valueGender}
        className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm '
        name='category_id'
      >
        <option value='' disabled>
          Chọn giới tính
        </option>
        <option value={0}>Nữ</option>
        <option value={1}>Nam</option>
        <option value={2}>Tất cả</option>
      </select>
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
