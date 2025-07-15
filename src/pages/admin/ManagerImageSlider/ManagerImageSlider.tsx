import { Spin, Table, TableColumnsType, theme, Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'
import { resources } from 'src/constants'
import ModalCreateImageSlider from './components/ModalCreateImageSlider'
import { useMutation, useQuery } from '@tanstack/react-query'
import imageSliderApi from 'src/apis/imageSlider.api'
import swalAlert from 'src/utils/SwalAlert'
import { toast } from 'react-toastify'

interface DataType {
  key: string
  urlImage: string
  link: string
  created_at: string
  updated_at: string
}
export default function ManagerImageSlider() {
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

  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)

  const {
    data: imageSliders,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['imageSliders'],
    queryFn: () => {
      return imageSliderApi.getAllImageSlider()
    }
  })
  const listImageSliders = imageSliders?.data.result

  const deleteImageSlierMutation = useMutation({
    mutationFn: imageSliderApi.deleteImageSlider
  })

  const handleDeleteImageSlider = (image_slider_id: string) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        deleteImageSlierMutation.mutate(
          {
            image_slider_id
          },
          {
            onSuccess: (res) => {
              toast.success(res.data.message)
              refetch()
            }
          }
        )
      }
    })
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Hình ảnh',
      width: 200,
      align: 'center',
      key: '1',
      render: (_, record: DataType) => (
        <div className='flex justify-center items-center w-full h-full'>
          <img src={record.urlImage} alt='Hình ảnh hệ thống' className='w-auto h-16 object-cover rounded-md' />
        </div>
      )
    },
    {
      title: 'Liên kết',
      width: 300,
      dataIndex: 'link',
      align: 'center',
      key: '2'
    },

    {
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '3'
    },
    {
      title: 'Ngày cập nhật',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '4'
    },
    {
      title: 'Thao tác',
      key: 'operation',
      fixed: 'right',
      dataIndex: 'key',
      width: 100,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Xoá hình ảnh hệ thống'>
            <Button
              className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600/90 flex items-center justify-center rounded-md'
              onClick={() => handleDeleteImageSlider(record.key)}
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
    listImageSliders?.map((item) => ({
      key: item._id,

      link: item.link,
      urlImage: item.urlImage[0].url,
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
        <title>Quản lý hình ảnh hệ thống - YOYO Store</title>
        <meta name='description' content='Quản lý danh mục YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <div className='rounded-md grid grid-cols-2 bg-gray-50 p-2 m-2'>
        <div className='flex col-span-1 text-lg font-bold capitalize mt-1'>Quản lý hình ảnh hệ thống</div>
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
              <span className=''>Thêm hình ảnh</span>
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
          </div>
        </div>
      </Content>
      <ModalCreateImageSlider isModalOpen={isOpenModalCreate} setIsModalOpen={setIsOpenModalCreate} />
    </div>
  )
}
