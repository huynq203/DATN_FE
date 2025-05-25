import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import categoryApi from 'src/apis/category.api'
interface Props {
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}

export default function CategorySelect({ onChange, value, errorMessage }: Props) {
  const [valueCategory, setValueCategory] = useState(value)

  const { data: listCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  const dataCategories = listCategories?.data.result.categories

  useEffect(() => {
    if (value) {
      setValueCategory(value)
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    const newCategory = value
    setValueCategory(newCategory)
    onChange && onChange(newCategory)
  }
  return (
    <div>
      <select
        onChange={handleChange}
        value={valueCategory}
        className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm '
        name='category_id'
      >
        <option value='' disabled>
          Chọn danh mục
        </option>
        {dataCategories?.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
