import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = {
  [key in 'name' | 'phone' | 'email' | 'password' | 'confirm_password' | 'forgot_password_token']?: RegisterOptions
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  name: {
    required: {
      value: true,
      message: 'Họ tên không được để trống'
    }
  },
  phone: {
    required: {
      value: true,
      message: 'Số điện thoại không được để trống'
    },
    pattern: {
      value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      message: 'Số điện thoại không hợp lệ'
    },
    maxLength: {
      value: 10,
      message: 'Số điện thoại không hợp lệ'
    },
    minLength: {
      value: 10,
      message: 'Số điện thoại không hợp lệ'
    }
  },
  email: {
    required: {
      value: true,
      message: 'Email không được để trống'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 đến 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 đến 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password không được để trống'
    },
    pattern: {
      value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      message: 'Password không hợp lệ'
    },
    minLength: {
      value: 8,
      message: 'Password từ 8 đến 20 ký tự'
    },
    maxLength: {
      value: 20,
      message: 'Password từ 8 đến 20 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Password không được để trống'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues('password') || 'Mật khẩu không khớp' : undefined
  }
})

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Xác nhận mật khẩu không được để trống')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Xác nhận mật khẩu không khớp')
}

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as {
    price_min: string
    price_max: string
  }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}
export const schema = yup.object({
  name: yup.string().required('Họ tên không được để trống'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại không hợp lệ')
    .max(10, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .required('Email không được để trống')
    .email('Email không đúng định dạng')
    .matches(/^\S+@\S+\.\S+$/, 'Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 đến 160 ký tự')
    .max(160, 'Độ dài từ 5 đến 160 ký tự'),
  password: yup
    .string()
    .required('Password không được để trống')
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password không hợp lệ')
    .min(8, 'Password từ 8 đến 20 ký tự')
    .max(20, 'Password từ 8 đến 20 ký tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  forgot_password_token: yup.string(),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  search_name: yup.string().trim().required('Tên không được để trống')
})

export const customerSchema = yup.object({
  name: yup.string().max(50, 'Tên không được quá 50 ký tự').required('Tên không được để trống'),
  email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại không hợp lệ')
    .max(10, 'Số điện thoại không hợp lệ'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn 1 ngày').required('Ngày sinh không hợp lệ'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_new_password: handleConfirmPasswordYup('new_password')
})

export const productsSchema = yup.object({
  category_id: yup.string().required('Yêu cầu chon danh mục sản phẩm'),
  name: yup.string().required('Tên sản phẩm không được để trống'),
  price: yup.string().typeError('Giá không hợp lệ').min(0, 'Giá không hợp lệ').required('Giá không được để trống'),
  promotion_price: yup.string().typeError('Giá không hợp lệ').required('Giá không được để trống'),
  stock: yup
    .string()
    .typeError('Số lượng không hợp lệ')
    .min(0, 'Số lượng không hợp lệ')
    .required('Số lượng không được để trống'),
  size: yup.string().required('Kích thước không được để trống'),
  color: yup.string().required('Màu sắc không được để trống'),
  description: yup.string().required('Mô tả không được để trống'),
  gender: yup.string().required('Vui lòng chọn giới tính'),
  target_person: yup.string().required('Vui lòng chọn đối tượng')
})

export const createProductSchema = yup.object({})

export type ProductSchema = yup.InferType<typeof productsSchema>
export type CustomerSchema = yup.InferType<typeof customerSchema>
export type Schema = yup.InferType<typeof schema>
