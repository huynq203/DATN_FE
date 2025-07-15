
import { Link } from 'react-router-dom'

import { paths } from 'src/constants'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId, rateSale } from 'src/utils/utils'
interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  // const { data: wishListData } = useQuery({
  //   queryKey: ['wishlist', product._id],
  //   queryFn: () => wishListApi.getWishListByProduct({ product_id: product._id })
  // })
  // console.log('Wishlist data for product:', wishListData)

  // const changeFavoriteMutation = useMutation({
  //   mutationFn: wishListApi.changeWishListByProduct
  // })
  // const handleChangeFavorite = (productId: string) => {
  //   console.log('Thay đổi trạng thái yêu thích cho sản phẩm:', productId)

  //   changeFavoriteMutation.mutate(
  //     { product_id: productId },
  //     {
  //       onSuccess: (ress) => {
  //         console.log('Cập nhật thành công:', ress.data.result)
  //       },
  //       onError: (error) => {
  //         console.error('Lỗi khi cập nhật:', error)
  //       }
  //     }
  //   )
  // }
  return (
    <div className='w-full'>
      <Link
        className='hover:text-black transition-colors duration-200'
        to={`${paths.Screens.PRODUCT}/${generateNameId({
          name: product.slug,
          id: product._id
        })}`}
      >
        <div className='shadow rounded-sm hover:translate-y-[-0.1rem] hover:shadow-md border transition-transform duration-200 overflow-hidden group h-[380px] flex flex-col relative'>
          {/* Gắn badge "Đã hết hàng" nếu hết hàng */}
          {product.total_stock === 0 && (
            <div className='absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-sm z-10'>
              Đã hết hàng
            </div>
          )}

          {/* Hình ảnh */}
          <div className='w-full pt-[100%] relative'>
            <img
              src={product.url_images.length > 0 ? product.url_images[0].url : ''}
              alt={product.name}
              className='absolute top-0 left-0 w-full h-full object-cover'
            />
          </div>

          {/* Thông tin */}
          <div className='p-2 flex flex-col flex-1 justify-between'>
            {/* Tên sản phẩm */}
            <div className='my-2 min-h-[2.5rem] text-lg font-bold line-clamp-2 leading-5'>{product.name}</div>

            {/* Giá & lượt xem */}
            <div className='text-sm text-gray-500'>
              <div className='flex items-center mb-1'>
                {product.promotion_price > 0 && (
                  <>
                    <div className='text-red-500 truncate text-lg font-semibold'>
                      ₫{formatCurrency(product.promotion_price)}
                    </div>
                    <div className='ml-1 mr-3 rounded-sm bg-red-200/90 px-1 py-[2px] text-[10px] uppercase text-red-500'>
                      {rateSale(product.price, product.promotion_price)}
                    </div>
                  </>
                )}
                <div
                  className={`${
                    product.promotion_price > 0 ? 'line-through text-gray-500 text-xs' : 'text-lg font-semibold'
                  } max-w-[50%] text-black truncate`}
                >
                  ₫{formatCurrency(product.price)}
                </div>
              </div>

              <div className='text-xs text-gray-600 flex'>
                <div>
                  <span>Lượt xem: {formatNumberToSocialStyle(product.view)}</span>
                  {' | '}
                  <span>Đã bán: {formatNumberToSocialStyle(product.sold)}</span>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
