import { Modal } from 'antd'
import ListOptionProduct from '../../ListOptionProduct'
import { Product } from 'src/types/product.type'
import productApi from 'src/apis/product.api'
import { useQuery } from '@tanstack/react-query'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  product_id: string
  onUpdateSuccess?: (ListProducts: Product[]) => void
}

export default function ModalManagerOptionProduct({ isModalOpen, setIsModalOpen, product_id, onUpdateSuccess }: Props) {
  const { refetch } = useQuery({
    queryKey: ['product', {}],
    queryFn: () => {
      return productApi.getProductManager({})
    }
  })
  const handleOk = async () => {
    setIsModalOpen(false)
    const result = await refetch()
    onUpdateSuccess?.(result.data?.data.result as Product[])
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      // title='Quản lý tồn kho'
      closable={{ 'aria-label': 'Custom Close Button' }}
      width={1300}

      onCancel={handleCancel}
      onOk={handleOk}
      open={isModalOpen}
    >
      <ListOptionProduct product_id={product_id as string} />
    </Modal>
  )
}
