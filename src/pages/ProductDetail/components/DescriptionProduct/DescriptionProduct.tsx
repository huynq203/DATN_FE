import { Product as ProductType } from 'src/types/product.type'
import DOMPurify from 'dompurify'
import { Collapse } from 'antd'
interface Props {
  product: ProductType
}
export default function DescriptionProduct({ product }: Props) {
  return (
    <div className='mt-1 shadow bg-white rounded-lg'>
      <Collapse
        items={[
          {
            key: '1',
            label: 'Mô tả sản phẩm',
            children: (
              <p>
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description.replace(/\n/g, '<br>')) }}
                />
              </p>
            )
          }
        ]}
      />
    </div>
  )
}
