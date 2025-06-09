import { PaymentMethod } from 'src/constants/enum'

export interface Order {
  address: string
  payment_method: number
  total_price: number
  discount_price: number
  code_voucher: string
  order_details: {
    cart_id: string
    product_id: string
    quantity: number
    size: number
    color: string
    cost_price: number
  }[]
}

export interface OrderResponse {
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: string
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash: string
}

export interface VnpayStatusType {
  payment_method: PaymentMethod
  vnp_ResponseCode: string
}

export interface OrderFilter {
  key_search?: string
  status?: string // 0: ẩn, 1: hiện
  order_status?: string
  payment_method?: string // 0: nữ, 1: nam, 2: unisex
  payment_status?: string // 0: trẻ em, 1: người lớn
}

export interface OrderManagerResponse {
  _id: string
  code_order: string
  address: {
    name: string
    phone: string
    address: string
  }
  order_status: number
  payment_method: number
  payment_status: number
  created_at: string
  updated_at: string
}
