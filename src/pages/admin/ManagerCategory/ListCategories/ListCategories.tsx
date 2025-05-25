import { Breadcrumb, Table, TableColumnsType, theme, Space, Tag } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { createStyles } from 'antd-style'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'
import { paths, resources } from 'src/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import { useState } from 'react'
import ModalCreateCategory from '../components/ModalCreateCategory'
import ModalUpdatetCategory from '../components/ModalUpdateCategory'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { MESSAGE } from 'src/constants/messages'

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

  const useStyle = createStyles(({ css, token }) => {
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

  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
  const [categoryDetail, setCategoryDetail] = useState<DataType>()

  const { data: listCategory, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  const categoryData = listCategory?.data.result.categories

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
              swalAlert.notifySuccess('Thông báo', 'Bạn đã xóa bản ghi thành công')
              refetch()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError('Thông báo', error.response?.data.message as string)
              } else {
                toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
              }
            }
          }
        )
      }
    })
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
      key: '2',
      sorter: true
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
          <Button
            className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-sm'
            onClick={() => {
              setIsOpenModalUpdate(true)
              setCategoryDetail(record)
            }}
          >
            Sửa
          </Button>
          <Button
            className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-sm'
            onClick={() => handleDelete(record.key)}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ]
  const dataSource =
    categoryData?.map((item) => ({
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
  return (
    <div className='container'>
      <Helmet>
        <title>Quản lý danh mục - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content style={{ margin: '0 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', paddingTop: 10 }}>
          <Breadcrumb.Item>{paths.Screens.ADMIN_MANAGER_CATEGORY}</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='grid grid-cols-2'>
            <div className='flex '>Quản lý sản phẩm</div>
            <div className='flex justify-end'>
              <Button
                className='bg-blue-200/90 text-blue-700 px-4 py-2 rounded-md font-bold'
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
          <div className='mt-5'>
            <Table<DataType>
              className={styles.customTable}
              columns={columns}
              dataSource={dataSource}
              bordered
              size='middle'
              scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
            />
            <ModalCreateCategory isModalOpen={isOpenModalCreate} setIsModalOpen={setIsOpenModalCreate} />
            <ModalUpdatetCategory
              isModalOpen={isOpenModalUpdate}
              setIsModalOpen={setIsOpenModalUpdate}
              categoryDetail={categoryDetail as DataType}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}
