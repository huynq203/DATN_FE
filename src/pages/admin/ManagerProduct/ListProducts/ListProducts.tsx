import { useMutation, useQuery } from '@tanstack/react-query'
import { Table, TableColumnsType, theme, Tag, Select, Input, Spin, Drawer, TableProps, Tooltip } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { JSX, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { paths, resources } from 'src/constants'
import { createStyles } from 'antd-style'
import Button from 'src/components/Button'
import swalAlert from 'src/utils/SwalAlert'
import { Helmet } from 'react-helmet-async'
import { formatCurrency, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { saveAs } from 'file-saver'
import { GenderType, StatusType, TargetType } from 'src/constants/enum'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'
import { toast } from 'react-toastify'
import ModalManagerOptionProduct from '../components/ModalManagerOptionProduct'
import categoryApi from 'src/apis/category.api'
import { ProductManagerList } from 'src/types/product.type'

interface DataType {
  key: string
  category_id: string
  code_product: string
  name: string
  image: JSX.Element
  price: string
  promotion_price?: string
  stock: number
  status: number
  gender: number
  target_person: number
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
  const [listProducts, setListProducts] = useState<ProductManagerList[]>([])
  const [isModalManagerOptionProduct, setIsModalManagerOptionProduct] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [productId, setProductId] = useState('')
  const [rowSelectionIds, setRowSelectionIds] = useState<string[]>([])
  const [keySearch, setKeySearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [gender, setGender] = useState('')
  const [targetPerson, setTargetPerson] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const {
    data: productData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: [
      'product',
      {
        key_search: keySearch,
        category_id: categoryId,
        status: status,
        gender: gender,
        targetPerson: targetPerson,
        priceMin: priceMin,
        priceMax: priceMax
      }
    ],
    queryFn: () => {
      return productApi.getProductManager({
        key_search: keySearch,
        category_id: categoryId,
        status: status,
        gender: gender,
        target_person: targetPerson,
        price_min: priceMin,
        price_max: priceMax
      })
    }
  })

  const { data: listCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  const dataCategories = listCategories?.data.result

  const dataSoucrceCategories = dataCategories?.map((item) => ({
    value: item._id,
    label: item.name
  }))
  const dataSourceGender = [
    { value: GenderType.Women.toString(), label: 'Nữ' },
    { value: GenderType.Men.toString(), label: 'Nam' },
    { value: GenderType.Unisex.toString(), label: 'Unisex' },
    { value: '', label: 'Tất cả' }
  ]
  const dataSourceTargetPerson = [
    { value: TargetType.Kid.toString(), label: 'Trẻ em' },
    { value: TargetType.Adult.toString(), label: 'Người lớn' },
    { value: '', label: 'Tất cả' }
  ]
  const dataSourceStatus = [
    { value: StatusType.Inactive.toString(), label: 'Inactive' },
    { value: StatusType.Active.toString(), label: 'Active' },
    { value: '', label: 'Tất cả' }
  ]

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
  }
  const exportFileMutation = useMutation({
    mutationFn: productApi.exportFileProduct,
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${new Date().toISOString()}_products_list.xlsx`)
    }
  })
  const handleExportFile = () => {
    if (rowSelectionIds.length === 0) {
      swalAlert.notifyError('Thông báo', 'Vui lòng chọn sản phẩm để xuất dữ liệu')
      return
    } else {
      swalAlert.showConfirmExportFile(rowSelectionIds.length, 'sản phẩm').then((result) => {
        if (result.isConfirmed) {
          exportFileMutation.mutate(rowSelectionIds)
          swalAlert.notifySuccess('Thông báo', 'Đang xuất dữ liệu, vui lòng đợi trong giây lát')
        }
      })
    }
  }
  const changeStatusProductMutation = useMutation({
    mutationFn: productApi.changeStatusProduct
  })
  const handleChangeStatusProduct = (product_id: string, status: number) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        changeStatusProductMutation.mutate(
          { product_id, status },
          {
            onSuccess: (res) => {
              swalAlert.notifySuccess('Thông báo', res.data.message)
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
  const handleResetFilter = () => {
    setKeySearch('')
    setCategoryId('')
    setStatus('')
    setGender('')
    setTargetPerson('')
    setPriceMin('')
    setPriceMax('')
    refetch()
  }

  const handleChangeSearchProduct = (event: any) => {
    setKeySearch(event.target.value)
  }
  const handleFilterChangeCategory = (value: string) => {
    setCategoryId(value)
  }
  const handleFilterChangeStatus = (value: string) => {
    setStatus(value)
  }

  const handleFilterChangeGender = (value: string) => {
    setGender(value)
  }
  const handleFilterChangeTargetPerson = (value: string) => {
    setTargetPerson(value)
  }

  const handleFilterChangePriceMin = (event: any) => {
    setPriceMin(event.target.value)
  }
  const handleFilterChangePriceMax = (event: any) => {
    setPriceMax(event.target.value)
  }

  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setRowSelectionIds(selectedRowKeys as string[])
    }
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Sản phẩm',
      width: 400,
      dataIndex: '',
      align: 'left',
      key: '0',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record: DataType) => {
        return (
          <div className='flex items-center justify-center'>
            <img src={record.image.props.src} alt={record.name} className='w-20 h-20 object-cover' />
            <div className='flex flex-col'>
              <span className='ml-2 line-clamp-2'> {record.name} </span>
              <span className='ml-2 text-gray-500'>Mã SP: {record.code_product}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Giá bán',
      width: 120,
      dataIndex: 'price',
      align: 'center',
      key: '1',
      sorter: (a, b) => a.price.localeCompare(b.price)
    },
    {
      title: 'Giảm giá',
      width: 100,
      dataIndex: 'promotion_price',
      align: 'center',
      key: '2',
      sorter: (a, b) => a.price.localeCompare(b.price)
    },
    {
      title: 'Tồn kho',
      width: 100,
      dataIndex: 'stock',
      align: 'center',
      key: '3',
      sorter: (a, b) => a.stock - b.stock
    },
    {
      title: 'Giới tính',
      width: 100,
      align: 'center',
      key: '4',
      sorter: (a, b) => a.gender - b.gender,
      render: (_, record: DataType) => {
        const gender = String(record.gender)
        if (gender === GenderType.Women.toString()) {
          return <Tag color='pink'>Nữ</Tag>
        } else if (gender === GenderType.Men.toString()) {
          return <Tag color='blue'>Nam</Tag>
        } else {
          return <Tag color='purple'>Unisex</Tag>
        }
      }
    },
    {
      title: 'Đối tượng SD',
      width: 120,
      align: 'center',
      key: '5',
      sorter: (a, b) => a.target_person - b.target_person,
      render: (_, record: DataType) => {
        if (record.target_person === TargetType.Kid) {
          return <Tag color='orange'>Trẻ em</Tag>
        } else {
          return <Tag color='green'>Người lớn</Tag>
        }
      }
    },
    {
      title: 'Trạng thái',
      width: 100,
      dataIndex: '',
      align: 'center',
      key: '6',
      render: (_, record: DataType) => (
        <>
          {record.status === StatusType.Inactive ? (
            <Button onClick={() => handleChangeStatusProduct(record.key, StatusType.Inactive)}>
              <Tag color='volcano'>Inactive</Tag>
            </Button>
          ) : (
            <Button onClick={() => handleChangeStatusProduct(record.key, StatusType.Active)}>
              <Tag color='green'>Active</Tag>
            </Button>
          )}
        </>
      )
    },
    {
      title: 'Người tạo',
      width: 100,
      dataIndex: 'created_by',
      align: 'center',
      key: '7'
    },
    {
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '8'
    },
    {
      title: 'Ngày cập nhật',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '9'
    },
    {
      title: 'Thao tác',
      key: 'operation',
      fixed: 'right',
      dataIndex: 'key',
      align: 'center',
      width: 180,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Quản lý tùy chọn sản phẩm'>
            {' '}
            <Button
              className='flex h-9 px-3 text-white bg-blue-500/90 text-sm hover:bg-blue-400 hover:text-white items-center justify-center rounded-md '
              onClick={() => {
                setIsModalManagerOptionProduct(true)
                setProductId(record.key as string)
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
                  d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip title='Chỉnh sửa sản phẩm'>
            {' '}
            <Link
              to={`${paths.Screens.ADMIN_EDIT_PRODUCT}/${record.key}`}
              className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-md'
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
            </Link>
          </Tooltip>
          <Tooltip title='Xóa sản phẩm'>
            {' '}
            <Button
              className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-md'
              onClick={handleDelete(record.key)}
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
    listProducts?.map((item) => ({
      key: item._id,
      category_id: item.category_id.name,
      code_product: item.code_product,
      name: item.name,
      image:
        item.url_images.length > 0 ? (
          <img src={item?.url_images[0].url} alt={item.name} className='w-20 h-20' />
        ) : (
          <img src='' alt={item.name} className='w-20 h-20' />
        ),
      price: formatCurrency(item.price) + ' đ',
      promotion_price: formatCurrency(item.promotion_price) + ' đ',
      status: item.status,
      gender: item.gender,
      target_person: item.target_person,
      stock: item.stock,
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
    if (productData?.data.result) {
      setListProducts(productData?.data.result)
    }
  }, [productData])
  return (
    <div>
      <Helmet>
        <title>Quản lý sản phẩm - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <div className='rounded-md grid grid-cols-2 bg-gray-50 p-2 m-2'>
        <div className='flex col-span-1 text-lg font-bold capitalize mt-1'>Quản lý sản phẩm</div>
        <div className='flex col-span-1 justify-end'>
          <Button
            onClick={handleExportFile}
            className='bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md font-bold mr-4'
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

              <span className='ml-1'>Xuất dữ liệu</span>
            </div>
          </Button>
          <Link
            to={paths.Screens.ADMIN_CREATE_PRODUCT}
            className='bg-blue-500 text-white hover:text-white hover:bg-blue-700 px-4 py-2 rounded-md font-bold'
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
              <span className='ml-1'>Thêm sản phẩm</span>
            </div>
          </Link>
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
          <div className='rounded-md bg-gray-50 p-2 '>
            <div className=' grid grid-cols-12'>
              <div className='flex col-span-3 text-lg capitalize mt-1 ml-3'>
                <Input.Search
                  placeholder='Tìm kiếm SP theo tên/mã'
                  onChange={handleChangeSearchProduct}
                  value={keySearch || undefined}
                />
              </div>
              <div className='flex  col-span-2 capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Chọn Danh Mục'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSoucrceCategories}
                  onChange={handleFilterChangeCategory}
                  value={categoryId || undefined}
                />
              </div>
              <div className='flex col-span-2  capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Chọn trạng thái'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourceStatus}
                  onChange={handleFilterChangeStatus}
                  value={status || undefined}
                />
              </div>
              <div className='flex col-span-2 capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Chọn giới tính'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourceGender}
                  onChange={handleFilterChangeGender}
                  value={gender || undefined}
                />
              </div>
              <div className='flex col-span-2  capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Chọn đối tượng'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourceTargetPerson}
                  onChange={handleFilterChangeTargetPerson}
                  value={targetPerson || undefined}
                />
              </div>
              <div className='flex col-span-1  capitalize mt-1 ml-3'>
                <Tooltip title='Reset bộ lọc tìm kiếm'>
                  <Button
                    className='flex h-8 px-2 text-black bg-gray-200 hover:bg-gray-300 text-sm  items-center justify-center rounded-md mr-3'
                    onClick={handleResetFilter}
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
                        d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                      />
                    </svg>
                  </Button>
                </Tooltip>
                <Tooltip title='Tìm kiếm nâng cao'>
                  {' '}
                  <Button
                    className='flex h-8 px-2 text-black bg-gray-200 hover:bg-gray-300 items-center justify-center rounded-md'
                    onClick={() => setIsOpenDrawer(true)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
                      />
                    </svg>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <Spin tip='Đang tải...' size='large' spinning={isLoading}>
              <Table<DataType>
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                bordered
                size='middle'
                scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
              />
            </Spin>
          </div>
          <ModalManagerOptionProduct
            isModalOpen={isModalManagerOptionProduct}
            setIsModalOpen={setIsModalManagerOptionProduct}
            product_id={productId}
            onUpdateSuccess={(listProducts) => {
              setListProducts(listProducts as ProductManagerList[])
            }}
          />
          <Drawer
            title='Tìm kiếm nâng cao'
            closable={false}
            onClose={() => {
              setIsOpenDrawer(false)
            }}
            open={isOpenDrawer}
            key={'right'}
          >
            <div className='flex text-lg capitalize mt-1'>
              <Input placeholder='Giá min' onChange={handleFilterChangePriceMin} value={priceMin || undefined} />
            </div>
            <div className='flex text-lg capitalize mt-3'>
              <Input placeholder='Giá max' onChange={handleFilterChangePriceMax} value={priceMax || undefined} />
            </div>
            <div className='flex justify-end text-lg capitalize mt-3'>
              <Button
                className='bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-md font-bold'
                onClick={handleResetFilter}
              >
                Clear
              </Button>
            </div>
          </Drawer>
        </div>
      </Content>
    </div>
  )
}
