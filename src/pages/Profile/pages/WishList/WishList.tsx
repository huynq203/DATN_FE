import { useMutation, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import wishListApi from 'src/apis/wishlist.api'
import Button from 'src/components/Button'
import { paths } from 'src/constants'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import { generateNameId, isAxiosUnprocessableEntityError } from 'src/utils/utils'

export default function WishList() {
  const { data: listWishListByCustomer, refetch } = useQuery({
    queryKey: ['wishListByCustomer'],
    queryFn: () => wishListApi.getWishListByCustomer()
  })

  const deleteWishListMutation = useMutation({
    mutationFn: wishListApi.deleteWishList
  })
  const handleDeleteWishList = (wishListId: string) => {
    deleteWishListMutation.mutate(
      { wish_list_id: wishListId },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          refetch()
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
            toast.error(error.response?.data.message)
          } else {
            toast.error(MESSAGE.SERVER_ERROR)
          }
        }
      }
    )
  }
  const wishListData = listWishListByCustomer?.data.result

  return (
    <div className='rounded-sm  px-7 pb-20 shadow'>
      <Helmet>
        <title>Sản phẩm yêu thích - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.WISH_LIST} />
      </Helmet>
      <div className='border-b border-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Sản phẩm yêu thích</h1>
      </div>
      {wishListData && wishListData.length > 0 ? (
        <div className='p-4 max-w-5xl mx-auto  '>
          {wishListData &&
            wishListData.map((item) => (
              <div className='no-underline' key={item._id}>
                <div key={item._id} className='grid grid-cols-2 border-b py-2 flex justify-between gap-1'>
                  <Link
                    to={`${paths.Screens.PRODUCT}/${generateNameId({
                      name: item.product?.slug as string,
                      id: item.product?._id as string
                    })}`}
                    className='col-span-1 flex'
                  >
                    <div className=''>
                      <img
                        src={item.product?.url_images[0].url}
                        alt={item.product?.name}
                        className='w-20 h-20 object-cover rounded-md'
                      />
                    </div>
                    <div className='ml-5'>
                      <div className='font-semibold'>{item.product?.name}</div>
                      <div className='text-sm text-gray-700'>{item.product?.code_product}</div>
                      <div className='text-sm text-gray-700'>
                        {item.product?.price.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </div>
                    </div>
                  </Link>
                  <div className='mt-2 space-x-2 col-span-1 flex justify-end items-center'>
                    <Button
                      className='px-3 py-1 bg-red-600/90 hover:bg-red-700/90 text-white rounded-md'
                      onClick={() => handleDeleteWishList(item._id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className='text-center mt-10 text-gray-500 font-semibold text-lg'>Sản phẩm yêu thích trống</div>
      )}
    </div>
  )
}
