import { useMutation, useQuery } from '@tanstack/react-query'
import { Breadcrumb, Table, TableColumnsType, theme, Space, Tag } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { JSX } from 'react'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { paths, resources } from 'src/constants'

import { createStyles } from 'antd-style'
import Button from 'src/components/Button'
import swalAlert from 'src/utils/SwalAlert'
import { Helmet } from 'react-helmet-async'
import { formatCurrency } from 'src/utils/utils'
import { saveAs } from 'file-saver'

interface DataType {
  key: string
  category_id: string
  name: string
  image: JSX.Element
  price: string
  status: number
  created_by: string
  created_at: string
  updated_at: string
}

export default function ListProducts() {
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

  const { data: productList, refetch } = useQuery({
    queryKey: ['product'],
    queryFn: () => {
      return productApi.getProductManager()
    }
  })

  const productData = productList?.data.result.products
  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      refetch()
    }
  })
  const handleDelete = (product_id: string) => () => {
    swalAlert.showConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        deleteProductMutation.mutate({ product_id })
        swalAlert.notifySuccess('Thông báo', 'Bạn đã xóa bản ghi thành công')
      }
    })
    // deleteProductMutation.mutate({ product_id })
  }
  const exportFileMutation = useMutation({
    mutationFn: productApi.exportFileProduct,
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${new Date().toISOString()}_product_list.xlsx`)
    }
  })
  const handleExportFile = () => {
    exportFileMutation.mutate()
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Trạng thái',
      width: 100,
      dataIndex: '',
      align: 'center',
      key: '0',
      render: (_, record: DataType) => (
        <>{record.status === 0 ? <Tag color='volcano'>Inactive</Tag> : <Tag color='green'>Active</Tag>}</>
      )
    },
    {
      title: 'Category',
      width: 100,
      dataIndex: 'category_id',
      align: 'center',
      key: '1'
    },
    {
      title: 'Tên sản phẩm',
      width: 300,
      dataIndex: 'name',
      align: 'center',
      key: '2',
      sorter: true
    },
    {
      title: 'Hình ảnh',
      width: 150,
      dataIndex: 'image',
      align: 'center',
      key: '3'
    },
    {
      title: 'Giá sản phẩm',
      width: 150,
      dataIndex: 'price',
      align: 'center',
      key: '4',
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
      width: 220,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Link
            to=''
            className='flex h-9 px-3 text-white bg-blue-500/90 text-sm hover:bg-blue-400 hover:text-white flex items-center justify-center rounded-sm'
          >
            Nhập hàng
          </Link>
          <Link
            to={`${paths.Screens.ADMIN_EDIT_PRODUCT}/${record.key}`}
            className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-sm'
          >
            Sửa
          </Link>
          <Button
            className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-sm'
            onClick={handleDelete(record.key)}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ]

  const dataSource =
    productData?.map((item) => ({
      key: item._id,
      category_id: item.category_id.name,
      name: item.name,
      image:
        item.url_images.length > 0 ? (
          <img src={item?.url_images[0].url} alt={item.name} className='w-20 h-20' />
        ) : (
          <img src='' alt={item.name} className='w-20 h-20' />
        ),
      price: formatCurrency(item.price) + ' đ',

      status: item.status,
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

  // useEffect(() => {
  //   refetch()
  // }, [])
  return (
    <div className='container'>
      <Helmet>
        <title>Quản lý sản phẩm - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content style={{ margin: '0 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', paddingTop: 10 }}>
          <Breadcrumb.Item>/manager-products</Breadcrumb.Item>
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
                onClick={handleExportFile}
                className='bg-blue-200/90 text-blue-700 px-4 py-2 rounded-md font-bold mr-4'
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
                      d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                    />
                  </svg>

                  <span className=''>Tải xuống</span>
                </div>
              </Button>
              <Link
                to={paths.Screens.ADMIN_CREATE_PRODUCT}
                className='bg-blue-200/90 text-blue-700 px-4 py-2 rounded-md font-bold'
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
                  <span className=''>Thêm sản phẩm</span>
                </div>
              </Link>
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
          </div>
        </div>
      </Content>
    </div>
  )
}
