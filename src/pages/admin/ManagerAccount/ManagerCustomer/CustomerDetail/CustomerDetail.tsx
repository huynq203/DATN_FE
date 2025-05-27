import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Table, TableColumnsType, theme } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import customerApi from 'src/apis/customer.api'
import { paths, resources } from 'src/constants'
import { FaUser, FaPhone, FaBirthdayCake, FaIdBadge } from 'react-icons/fa'
import addressApi from 'src/apis/address.api'

interface DataType {
  key: string
  name: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}
export default function CustomerDetail() {
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
  const { customer_id } = useParams()

  const { data: customerDetail } = useQuery({
    queryKey: ['customerDetail', customer_id],
    queryFn: () => {
      return customerApi.getCustomerDetail(customer_id as string)
    }
  })
  const customerData = customerDetail?.data.result

  const { data: addressData } = useQuery({
    queryKey: ['addressList', customer_id],
    queryFn: () => {
      return addressApi.getAddressManagerByCustomer(customer_id as string)
    }
  })
  const listAddress = addressData?.data.result

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Họ tên',
      width: 50,
      dataIndex: 'name',
      align: 'center',
      key: '1'
    },
    {
      title: 'Điện thoại',
      width: 50,
      dataIndex: 'phone',
      align: 'center',
      key: '2',
      sorter: true
    },
    {
      title: 'Địa chỉ',
      width: 50,
      dataIndex: 'address',
      align: 'center',
      key: '3'
    },

    {
      title: 'Ngày tạo',
      width: 50,
      dataIndex: 'created_at',
      align: 'center',
      key: '5'
    },
    {
      title: 'Ngày cập nhật',
      width: 50,
      dataIndex: 'updated_at',
      align: 'center',
      key: '6'
    }
  ]
  const dataSource =
    listAddress?.map((item) => ({
      key: item._id,
      name: item.name,
      phone: item.phone,
      address: item.address,
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
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0', paddingTop: 24 }}>
        <Breadcrumb.Item>
          <div className='flex items-center gap-2 text-gray-700'>
            <Link
              to={paths.Screens.ADMIN_MANAGER_CUSTOMER}
              className='flex items-center gap-2 text-gray-700 hover:text-blue-600'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='size-6'
              >
                <path stroke-linecap='round' stroke-linejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
              </svg>
            </Link>
            {paths.Screens.ADMIN_MANAGER_CUSTOMER}/{customerData?.name}
          </div>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG
        }}
      >
        <Helmet>
          <title>Thông tin khách hàng - YOYO Store</title>
          <meta name='description' content='Thêm sản phẩm YOYO Store' />
          <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
        </Helmet>
        <div>
          <div className='mt-6 p-6 bg-white rounded shadow-md'>
            <div className='text-xl font-semibold text-gray-700 mb-4 border-b pb-2'>Thông Tin Khách Hàng</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-800'>
              <div className='flex items-center space-x-2'>
                <FaIdBadge className='text-blue-600' />
                <div>
                  <span className='font-medium text-gray-500'>Mã khách hàng: </span>
                  <span className='text-blue-600'>{customer_id}</span>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <FaUser className='text-blue-500' />
                <div>
                  <span className='font-medium text-gray-500'>Tên khách hàng: </span>
                  <span className='text-blue-600'>{customerData?.name}</span>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <FaPhone className='text-blue-500' />
                <div>
                  <span className='font-medium text-gray-500'>Số điện thoại: </span>
                  <span className='text-blue-600'>{customerData?.phone}</span>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <FaBirthdayCake className='text-blue-500' />
                <div>
                  <span className='font-medium text-gray-500'>Ngày sinh: </span>
                  <span className='text-blue-600'>
                    {new Date(customerData?.date_of_birth as string).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4 p-4 shadow bg-white'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize'>Địa chỉ nhận hàng</div>
            <div className='mt-2'>
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
        </div>
      </div>
    </Content>
  )
}
