import { range } from 'lodash'
import React, { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    day: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })
  useEffect(() => {
    if (value) {
      setDate({
        day: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      day: value?.getDate() || date.day,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.day))
  }
  return (
    <div className='flex flex-wrap sm:flex-row'>
      <div className='w-[20%] truncate pt-3 text-right capitalize'>Ngày sinh</div>
      <div className='flex justify-between w-[50%]'>
        <div className='w-[35%] pl-5'>
          <select
            onChange={handleChange}
            name='day'
            value={value?.getDate() || date.day}
            className='h-10 w-full rounded-sm border border-black/10 px-3 py-2 cursor-pointer hover:border-red-500'
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='w-[35%] pl-5'>
          <select
            onChange={handleChange}
            name='month'
            className='h-10 w-full rounded-sm border border-black/10 px-3 py-2 cursor-pointer hover:border-red-500'
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
        </div>
        <div className='w-[35%] pl-5'>
          <select
            onChange={handleChange}
            name='year'
            value={value?.getFullYear() || date.year}
            className='h-10 w-full rounded-sm border border-black/10 px-3 py-2 cursor-pointer hover:border-red-500'
          >
            <option disabled>Năm</option>
            {range(1900, 2026).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
