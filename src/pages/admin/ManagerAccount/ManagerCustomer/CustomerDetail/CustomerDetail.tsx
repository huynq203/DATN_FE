import { useQuery } from '@tanstack/react-query'
import {  Table, TableColumnsType, theme } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import customerApi from 'src/apis/customer.api'
import { paths, resources } from 'src/constants'
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

  const { data: addressesData } = useQuery({
    queryKey: ['addresses', customer_id],
    queryFn: () => {
      return addressApi.getAddressManagerByCustomer(customer_id as string)
    }
  })
  const listAddresses = addressesData?.data.result

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
      key: '2'
    },
    {
      title: 'Địa chỉ',
      width: 100,
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
    listAddresses?.map((item) => ({
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
    <div className=''>
      <Helmet>
        <title>Thông tin khách hàng - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div>
            <div className='p-6 bg-white rounded shadow-md'>
              <div className='flex'>
                {' '}
                <Link to={paths.Screens.ADMIN_MANAGER_CUSTOMER} className='mt-1 mr-4'>
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
                <div className='text-xl text-black font-bold mb-4 pb-2'> Thông Tin Khách Hàng</div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-800'>
                <div className='flex items-center space-x-2'>
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
                      d='M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z'
                    />
                  </svg>

                  <div>
                    <span className='font-medium text-gray-500'>Mã khách hàng: </span>
                    <span className='text-black font-bold'>{customer_id}</span>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
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
                      d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                    />
                  </svg>

                  <div>
                    <span className='font-medium text-gray-500'>Tên khách hàng: </span>
                    <span className='text-black font-bold'>{customerData?.name}</span>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
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
                      d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z'
                    />
                  </svg>

                  <div>
                    <span className='font-medium text-gray-500'>Số điện thoại: </span>
                    <span className='text-black font-bold'>{customerData?.phone}</span>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
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
                      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
                    />
                  </svg>

                  <div>
                    <span className='font-medium text-gray-500'>Ngày sinh: </span>
                    <span className='text-black font-bold'>
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
              <div className='rounded bg-gray-50 p-4 text-lg capitalize font-bold'>Địa chỉ nhận hàng</div>
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
    </div>
  )
}
