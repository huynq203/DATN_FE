import React from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import { paths } from 'src/constants'
import { QueryConfig } from '../../ProductList'
import { Category, CategoryList } from 'src/types/category.type'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUnderfinedField } from 'src/types/utils.type'
interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUnderfinedField<Pick<Schema, 'price_min' | 'price_max'>>
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ queryConfig, categories }: Props) {
  const navigate = useNavigate()
  const { category_id } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema as any)
  })

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: paths.Screens.PRODUCT,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min || '1',
        price_max: data.price_max
      }).toString()
    })
  })
  return (
    <div className='py-4 '>
      <Link to={paths.Screens.PRODUCT} className='flex imtes-center font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='size-6'
        >
          <path stroke-linecap='round' stroke-linejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' />
        </svg>
        <span
          className={classNames('ml-1 mt-1 font-bold', {
            'text-red-500': category_id === undefined
          })}
        >
          Tất cả danh mục
        </span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4 ' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category_id === categoryItem._id
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: paths.Screens.PRODUCT,
                  search: createSearchParams({
                    ...queryConfig,
                    category_id: categoryItem._id
                  }).toString()
                }}
                className={classNames('flex relative px-2', {
                  'text-red-500  font-bold': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='h-2 w-2 absolute top-1 left-[10px] fill-red-500'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                <span className='ml-4'>{categoryItem.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={paths.Screens.PRODUCT} className='flex items-center font-bold mt-4 uppercase'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='size-6'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
          />
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='my-5'>
        <span>Khoảng giá</span>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='đ Từ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-2xl'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />

            <div className='mx-1 mt-1 shrink-0'> -- </div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='đ Từ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-2xl'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.price_min?.message}</div>
          <Button className='w-full p-2 uppercase bg-red-400 hover:bg-red-600 text-white text-sm rounded-md flex justify-center items-center'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      {/* <span>Đánh giá</span>
      <ul className='my-3'>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset={0} stopColor='#ffca11' />
                      <stop offset={1} stopColor='#ffad27' />
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    />
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            <span className='text-xs'>Trở lên</span>
          </Link>
        </li>
        <li className='flex py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset={0} stopColor='#ffca11' />
                      <stop offset={1} stopColor='#ffad27' />
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    />
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            <svg viewBox='0 0 30 30' className='h-4 w-4'>
              <defs>
                <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                  <stop offset='0%' stopColor='#FFD211' />
                  <stop offset='100%' stopColor='#FFAD27' />
                </linearGradient>
              </defs>
              <path
                fill='none'
                fillRule='evenodd'
                stroke='url(#star__hollow)'
                strokeWidth={2}
                d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
              />
            </svg>
            <span className='text-xs'>Trở lên</span>
          </Link>
        </li>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset={0} stopColor='#ffca11' />
                      <stop offset={1} stopColor='#ffad27' />
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    />
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 30 30' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                      <stop offset='0%' stopColor='#FFD211' />
                      <stop offset='100%' stopColor='#FFAD27' />
                    </linearGradient>
                  </defs>
                  <path
                    fill='none'
                    fillRule='evenodd'
                    stroke='url(#star__hollow)'
                    strokeWidth={2}
                    d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
                  />
                </svg>
              ))}
            <span className='text-xs'>Trở lên</span>
          </Link>
        </li>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset={0} stopColor='#ffca11' />
                      <stop offset={1} stopColor='#ffad27' />
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    />
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 30 30' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                      <stop offset='0%' stopColor='#FFD211' />
                      <stop offset='100%' stopColor='#FFAD27' />
                    </linearGradient>
                  </defs>
                  <path
                    fill='none'
                    fillRule='evenodd'
                    stroke='url(#star__hollow)'
                    strokeWidth={2}
                    d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
                  />
                </svg>
              ))}
            <span className='text-xs'>Trở lên</span>
          </Link>
        </li>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(1)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset={0} stopColor='#ffca11' />
                      <stop offset={1} stopColor='#ffad27' />
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    />
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 30 30' className='h-4 w-4'>
                  <defs>
                    <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                      <stop offset='0%' stopColor='#FFD211' />
                      <stop offset='100%' stopColor='#FFAD27' />
                    </linearGradient>
                  </defs>
                  <path
                    fill='none'
                    fillRule='evenodd'
                    stroke='url(#star__hollow)'
                    strokeWidth={2}
                    d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
                  />
                </svg>
              ))}
            <span className='text-xs'>Trở lên</span>
          </Link>
        </li>
      </ul>
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button className='w-full p-2 uppercase bg-red-400 hover:bg-red-600 text-white text-sm rounded-md flex justify-center items-center'>
        Xóa tất cả
      </Button> */}
    </div>
  )
}
