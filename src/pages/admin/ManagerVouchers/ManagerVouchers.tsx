import { Breadcrumb, Table, TableColumnsType, Tag, theme } from 'antd'
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

  const { data: listVouchers, refetch } = useQuery({
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
        swalAlert.notifySuccess('Thông báo', 'Bạn đã xóa bản ghi thành công')
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
              <Tag color='volcano'>Inactive</Tag>
            </Button>
          ) : (
            <Button>
              <Tag color='green'>Active</Tag>
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
          <Button
            className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-sm'
            onClick={() => {
              setIsModalOpenUpdate(true)
              setVoucherDetail(record)
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
    vouchersData?.map((item) => ({
      key: item._id,
      name: item.name,
      code: item.code,
      discount: item.discount,
      discount_convert: formatCurrency(item.discount) + ' đ',
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
    <div className='container'>
      <Helmet>
        <title>Quản lý sản phẩm - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content style={{ margin: '0 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', paddingTop: 10 }}>
          <Breadcrumb.Item>{paths.Screens.ADMIN_MANAGER_VOUCHER}</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='rounded bg-gray-50 p-4'>
            <div className='grid grid-cols-2'>
              <div className='flex text-lg capitalize mt-1'>Quản lý voucher</div>
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
            <Table<DataType>
              className={styles.customTable}
              columns={columns}
              dataSource={dataSource}
              bordered
              size='middle'
              scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
            />
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
