import { Modal } from 'antd'
import ListOptionProduct from '../../ListOptionProduct'
import { Product } from 'src/types/product.type'
import productApi from 'src/apis/product.api'
import { useQuery } from '@tanstack/react-query'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  product_id: string
  onUpdateSuccess?: (ListUsers: Product[]) => void
}

export default function ModalManagerOptionProduct({ isModalOpen, setIsModalOpen, product_id, onUpdateSuccess }: Props) {
  const { refetch } = useQuery({
    queryKey: ['product', {}],
    queryFn: () => {
      return productApi.getProductManager({})
    }
  })
  const handleCancel = async () => {
    setIsModalOpen(false)
    const result = await refetch()
    onUpdateSuccess?.(result.data?.data.result as Product[])
  }
  return (
    <Modal
      // title='Quản lý tồn kho'
      closable={{ 'aria-label': 'Custom Close Button' }}
      width={1300}
      centered
      onCancel={handleCancel}
      onOk={handleCancel}
      open={isModalOpen}
    >
      <ListOptionProduct product_id={product_id as string} />
    </Modal>
  )
}
