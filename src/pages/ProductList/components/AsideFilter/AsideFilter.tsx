import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import { paths } from 'src/constants'
import { Category } from 'src/types/category.type'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUnderfinedField } from 'src/types/utils.type'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import {  Collapse, CollapseProps } from 'antd'

import { GenderType } from 'src/constants/enum'
interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUnderfinedField<Pick<Schema, 'price_min' | 'price_max'>>
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ queryConfig, categories }: Props) {
  const navigate = useNavigate()

  const { category_id } = queryConfig
  const { gender } = queryConfig
  const { target_person } = queryConfig

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
  const itemsCategories: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Tất cả danh mục',
      children: (
        <ul className='space-y-1'>
          <li className='relative'>
            <Link
              to={paths.Screens.PRODUCT}
              className={classNames(
                'group flex items-center px-5 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-black hover:font-bold',
                {
                  'bg-gray-200  text-black font-bold': category_id === undefined,
                  'text-gray-700': category_id !== undefined
                }
              )}
            >
              {category_id === undefined && (
                <svg viewBox='0 0 4 7' className='absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 fill-black'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              <span className='ml-4'>Tất cả danh mục</span>
            </Link>
          </li>

          {categories.map((categoryItem) => {
            const isActive = category_id === categoryItem._id
            return (
              <li key={categoryItem._id} className='relative'>
                <Link
                  to={{
                    pathname: paths.Screens.PRODUCT,
                    search: createSearchParams({
                      ...queryConfig,
                      category_id: categoryItem._id
                    }).toString()
                  }}
                  className={classNames(
                    'group flex items-center px-5 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-black hover:font-bold',
                    {
                      'bg-gray-200  text-black font-bold': isActive,
                      'text-gray-700': !isActive
                    }
                  )}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 fill-black'>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}
                  <span className='ml-4'>{categoryItem.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )
    }
  ]

  const itemsGenders: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Giới tính',
      className: '',
      children: (
        <ul>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input
              type='checkbox'
              className='h-5 w-5 accent-black'
              value={0}
              checked={gender === GenderType.Women.toString()}
            />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  gender: GenderType.Women.toString()
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': gender === GenderType.Women.toString()
                })}
              >
                Nữ
              </span>
            </Link>
          </li>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input
              type='checkbox'
              className='h-5 w-5 accent-black'
              value={0}
              checked={gender === GenderType.Men.toString()}
            />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  gender: GenderType.Men.toString()
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': gender === GenderType.Men.toString()
                })}
              >
                Nam
              </span>
            </Link>
          </li>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input
              type='checkbox'
              className='h-5 w-5 accent-black'
              value={2}
              checked={gender === GenderType.Unisex.toString()}
            />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  gender: GenderType.Unisex.toString()
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': gender === GenderType.Unisex.toString()
                })}
              >
                Nam và nữ
              </span>
            </Link>
          </li>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input
              type='checkbox'
              className='h-5 w-5 accent-black'
              value={2}
              checked={gender === GenderType.All.toString()}
            />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  gender: GenderType.All.toString()
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': gender === GenderType.All.toString()
                })}
              >
                Tất cả
              </span>
            </Link>
          </li>
        </ul>
      )
    }
  ]

  const itemsTarget: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Đối tượng',
      className: '',
      children: (
        <ul>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input type='checkbox' className='h-5 w-5 accent-black' value={0} checked={target_person === '0'} />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  target_person: '0'
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': target_person === '0'
                })}
              >
                Trẻ em
              </span>
            </Link>
          </li>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input type='checkbox' className='h-5 w-5 accent-black' value={1} checked={target_person === '1'} />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  target_person: '1'
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': target_person === '1'
                })}
              >
                Người lớn
              </span>
            </Link>
          </li>
          <li className='flex hover:font-bold hover:text-black mt-3'>
            <input type='checkbox' className='h-5 w-5 accent-black' value={1} checked={target_person === '2'} />
            <Link
              to={{
                pathname: paths.Screens.PRODUCT,
                search: createSearchParams({
                  ...queryConfig,
                  target_person: '2'
                }).toString()
              }}
              className='hover:text-black'
            >
              <span
                className={classNames('ml-4', {
                  'font-bold': target_person === '2'
                })}
              >
                Tất cả
              </span>
            </Link>
          </li>
        </ul>
      )
    }
  ]

  const itemsPrices: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Khoảng giá',
      className: '',
      children: (
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
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-700 rounded-md'
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
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-700 rounded-md'
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
          <Button className='w-full p-2 border border-2 border-black text-black text-lg hover:bg-black hover:text-white transition-all duration-300  rounded-md flex justify-center items-center'>
            Áp dụng
          </Button>
        </form>
      )
    }
  ]

  return (
    <div className='hidden md:block  md:py-4 '>
      <Collapse items={itemsCategories} defaultActiveKey={['1']} />
      <div className='mt-3'></div>
      <Collapse items={itemsGenders} defaultActiveKey={['1']} />
      <div className='mt-3'></div>
      <Collapse items={itemsTarget} defaultActiveKey={['1']} />
      <div className='mt-3'></div>
      <Collapse items={itemsPrices} defaultActiveKey={['1']} />

      {/* <Link to={paths.Screens.PRODUCT} className='flex items-center font-bold mt-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='size-5'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
          />
        </svg>
        <span className='ml-1'>Bộ lọc tìm kiếm</span>
      </Link> */}
      {/* <div className='bg-gray-300 h-[1px] my-4' /> */}

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
