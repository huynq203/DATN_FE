import { Breadcrumb, Spin, Table, TableColumnsType, Tag, theme, Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'
import { paths, resources } from 'src/constants'
import { StatusType } from 'src/constants/enum'
import ModalCreateVoucher from './components/ModalCreateVoucher'
import { useMutation, useQuery } from '@tanstack/react-query'
import voucherApi from 'src/apis/voucher.api'
import { formatCurrency, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import ModalUpdateVoucher from './components/ModalUpdateVoucher'
import swalAlert from 'src/utils/SwalAlert'
import { toast } from 'react-toastify'

interface DataType {
  key: string
  name: string
  code: string
  discount: number
  discount_convert: string
  quantity: number
  status: StatusType
  time_start: string
  time_end: string
  created_by: string
  created_at: string
  updated_at: string
}

export default function ManagerVouchers() {
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

  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false)
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
  const [voucherDetail, setVoucherDetail] = useState<DataType>()

  const {
    data: listVouchers,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => {
      return voucherApi.getAllVoucher()
    }
  })
  const vouchersData = listVouchers?.data.result

  const delteVoucherMutation = useMutation({
    mutationFn: voucherApi.deleteVoucher,
    onSuccess: () => {
      refetch()
    }
  })
  const handleDelete = (voucher_id: string) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        delteVoucherMutation.mutate({ voucher_id })
        swalAlert.notifySuccess('Bạn đã xóa bản ghi thành công')
      }
    })
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Trạng thái',
      width: 100,
      dataIndex: 'status',
      align: 'center',
      key: '0',
      render: (_, record: DataType) => (
        <>
          {record.status === StatusType.Inactive ? (
            <Button>
              <Tag color='volcano'>Kết thúc</Tag>
            </Button>
          ) : (
            <Button>
              <Tag color='green'>Đang chạy</Tag>
            </Button>
          )}
        </>
      )
    },

    {
      title: 'Tên voucher',
      width: 200,
      dataIndex: 'name',
      align: 'center',
      key: '1'
    },
    {
      title: 'Mã giảm giá',
      width: 150,
      dataIndex: 'code',
      align: 'center',
      key: '2'
    },
    {
      title: 'Giá giảm',
      width: 150,
      dataIndex: 'discount_convert',
      align: 'center',
      key: '3'
    },
    {
      title: 'Số lượng',
      width: 150,
      dataIndex: 'quantity',
      align: 'center',
      key: '4'
    },
    {
      title: 'Thời gian bắt đầu',
      width: 200,
      dataIndex: 'time_start',
      align: 'center',
      key: '5'
    },
    {
      title: 'Thời gian kết thúc',
      width: 200,
      dataIndex: 'time_end',
      align: 'center',
      key: '6'
    },
    {
      title: 'Người tạo',
      width: 200,
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
      key: '10',
      fixed: 'right',
      dataIndex: 'key',
      width: 120,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Cập nhật voucher'>
            <Button
              className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                setIsModalOpenUpdate(true)
                setVoucherDetail(record)
              }}
              disabled={record.status === StatusType.Inactive ? false : true}
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
          <Tooltip title='Xóa voucher'>
            <Button
              className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => handleDelete(record.key)}
              disabled={record.status === StatusType.Inactive ? false : true}
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
    vouchersData?.map((item) => ({
      key: item._id,
      name: item.name,
      code: item.code,
      discount: item.discount,
      discount_convert: item.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      quantity: item.quantity,
      status: item.status,
      time_start: new Date(item.time_start).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time_end: new Date(item.time_end).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      created_by: item.created_by?.name || 'N/A',
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
        <title>Quản lý Vourcher - YOYO Store</title>
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
          <div className='rounded bg-gray-50 p-4'>
            <div className='grid grid-cols-2'>
              <div className='flex text-lg capitalize mt-1 font-bold'>Quản lý voucher</div>
              <div className='flex justify-end'>
                <Button
                  className='bg-blue-200/90 text-blue-700 hover:bg-blue-300/90 px-4 py-2 rounded-md font-bold mr-4'
                  onClick={() => setIsModalOpenCreate(true)}
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
                    <span className=''>Thêm vourcher</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <Spin spinning={isLoading} tip='Đang tải dữ liệu...' size='large'>
              <Table<DataType>
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                bordered
                size='middle'
                scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
              />
            </Spin>
            <ModalCreateVoucher isModalOpen={isModalOpenCreate} setIsModalOpen={setIsModalOpenCreate} />
            <ModalUpdateVoucher
              isModalOpen={isModalOpenUpdate}
              setIsModalOpen={setIsModalOpenUpdate}
              voucherDetail={voucherDetail as DataType}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}
