import {  Table, TableColumnsType, theme,Input, Spin, Tooltip } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { createStyles } from 'antd-style'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'
import { resources } from 'src/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import { useEffect, useState } from 'react'
import ModalCreateCategory from '../components/ModalCreateCategory'
import ModalUpdatetCategory from '../components/ModalUpdateCategory'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { MESSAGE } from 'src/constants/messages'
import { Category } from 'src/types/category.type'

interface DataType {
  key: string
  name: string
  description: string
  created_by: string
  created_at: string
  updated_at: string
}
export default function ListCategories() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const useStyle = createStyles(({ css }) => {
    return {
      customTable: css`
        .ant-table {
          .ant-table-container {
            .ant-table-body,
            .ant-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `
    }
  })
  const { styles } = useStyle()

  const [listCategories, setListCategories] = useState<Category[]>([])
  const [keySearch, setKeySearch] = useState<string>('')
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
  const [categoryDetail, setCategoryDetail] = useState<DataType>()

  const {
    data: CategoriesData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['categories', { key_search: keySearch }],
    queryFn: () => {
      return categoryApi.getCategoryManager({ key_search: keySearch })
    }
  })

  const deleleCategoryMutation = useMutation({
    mutationFn: categoryApi.deleteCategory
  })
  const handleDelete = (category_id: string) => {
    swalAlert.showConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        deleleCategoryMutation.mutate(
          { category_id },
          {
            onSuccess: () => {
              swalAlert.notifySuccess('Bạn đã xóa bản ghi thành công')
              refetch()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError(error.response?.data.message as string)
              } else if (isAxiosForbiddenError<ErrorResponseApi>(error)) {
                swalAlert.notifyError(error.response?.data.message as string)
              } else {
                toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
              }
            }
          }
        )
      }
    })
  }

  const handleOnchangeSearchCategory = (event: any) => {
    setKeySearch(event.target.value)
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Tên danh mục',
      width: 100,
      dataIndex: 'name',
      align: 'center',
      key: '1'
    },
    {
      title: 'Mô tả',
      width: 300,
      dataIndex: 'description',
      align: 'center',
      key: '2'
    },
    {
      title: 'Người tạo',
      width: 150,
      dataIndex: 'created_by',
      align: 'center',
      key: '6'
    },
    {
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '7'
    },
    {
      title: 'Ngày cập nhật',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '8'
    },
    {
      title: 'Thao tác',
      key: 'operation',
      fixed: 'right',
      dataIndex: 'key',
      width: 100,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Cập nhật danh mục'>
            <Button
              className='flex h-9 px-3 text-white bg-yellow-500/90 text-sm hover:bg-yellow-400/90 flex items-center justify-center rounded-md'
              onClick={() => {
                setIsOpenModalUpdate(true)
                setCategoryDetail(record)
              }}
            >
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
                  d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip title='Xoá danh mục'>
            <Button
              className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600/90 flex items-center justify-center rounded-md'
              onClick={() => handleDelete(record.key)}
            >
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
                  d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                />
              </svg>
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]
  const dataSource =
    listCategories?.map((item) => ({
      key: item._id,
      name: item.name,
      description: item.description,
      created_by: item.created_by.name,
      created_at: new Date(item.created_at).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      updated_at: new Date(item.updated_at).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    })) || []
  useEffect(() => {
    if (CategoriesData) {
      setListCategories(CategoriesData.data.result)
    }
  }, [CategoriesData])
  return (
    <div className=''>
      <Helmet>
        <title>Quản lý danh mục - YOYO Store</title>
        <meta name='description' content='Quản lý danh mục YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <div className='rounded-md grid grid-cols-2 bg-gray-50 p-2 m-2'>
        <div className='flex col-span-1 text-lg font-bold capitalize mt-1'>Quản lý danh mục</div>
        <div className='flex col-span-1 justify-end'>
          <Button
            className='bg-blue-500 text-white hover:text-white hover:bg-blue-700 px-4 py-2 rounded-md font-bold'
            onClick={() => setIsOpenModalCreate(true)}
          >
            <div className='flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
              <span className=''>Thêm danh mục</span>
            </div>
          </Button>
        </div>
      </div>
      <Content>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='rounded bg-gray-50 p-4'>
            <div className='grid grid-cols-4'>
              <div className='flex col-span-3 text-lg capitalize mt-1 mr-4'></div>
              <div className='flex col-span-1 justify-end'>
                <Input.Search placeholder='Tìm kiếm danh mục...' onChange={handleOnchangeSearchCategory} />
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <Spin size='large' tip='Đang tải...' spinning={isLoading}>
              {' '}
              <Table<DataType>
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                bordered
                size='middle'
              />
            </Spin>
            <ModalCreateCategory
              isModalOpen={isOpenModalCreate}
              setIsModalOpen={setIsOpenModalCreate}
              onUpdateSuccess={(listCategories) => {
                setListCategories(listCategories as Category[])
              }}
            />
            <ModalUpdatetCategory
              isModalOpen={isOpenModalUpdate}
              setIsModalOpen={setIsOpenModalUpdate}
              categoryDetail={categoryDetail as DataType}
              onUpdateSuccess={(listCategories) => {
                setListCategories(listCategories as Category[])
              }}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}
