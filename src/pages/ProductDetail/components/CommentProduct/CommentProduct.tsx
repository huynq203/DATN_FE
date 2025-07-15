import { Collapse, Rate } from 'antd'
import { RatingRes } from 'src/types/ratings.type'
interface Props {
  listRatings: RatingRes[]
  totalRatings?: number
}
export default function CommentProduct({ listRatings, totalRatings }: Props) {
  return (
    <div className='mt-1 shadow bg-white rounded-lg'>
      <Collapse
        items={[
          {
            key: '1',
            label: `Đánh giá sản phẩm (${totalRatings} lượt đánh giá)`,
            children: (
              <div className='space-y-4'>
                {listRatings?.length > 0 ? (
                  listRatings.map((rating: any) => (
                    <div key={rating._id} className='border-b pb-2'>
                      <div className='flex justify-between items-center'>
                        <strong>{rating.customer_name || 'Người dùng ẩn danh'}</strong>
                        <Rate disabled defaultValue={rating.star} />
                      </div>
                      <p className='text-gray-600 text-sm'>{rating.comment}</p>
                      <p className='text-xs text-gray-400'>{new Date(rating.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500 italic'>Chưa có đánh giá nào cho sản phẩm này.</p>
                )}
              </div>
            )
          }
        ]}
      />
    </div>
  )
}
