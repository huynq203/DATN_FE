

export interface Order {
  address: string
  payment_method: number
  total_price: number
  discount_price: number
  code_voucher: string
  order_details: OrderDetail[]
}

export interface OrderDetail {
  cart_id: string
  product_id: string
  quantity: number
  size: number
  color: string
  cost_price: number
  price: number
  image: string
}

export interface OrderDetailResponse {
  _id: string
  order_details: OrderDetailResponseItem[]
}

export interface OrderDetailResponseItem {
  _id: string
  product_id: {
    _id: string
    name: string
  }
  quantity: number
  size: number
  color: string
  cost_price: number
  price: number
  image: string
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
  payment_method: number
  vnp_ResponseCode: string
}

export interface MomoStatusType {
  payment_method: number
  resultCode: string
}

export interface OrderFilter {
  key_search?: string
  order_status?: string
  payment_method?: string // 0: nữ, 1: nam, 2: unisex
  payment_status?: string // 0: trẻ em, 1: người lớn
  date_start?: string // YYYY-MM-DD
  date_end?: string // YYYY-MM-DD
}

export interface OrderFilterByCustomer {
  order_status?: string
}

export interface OrderResponse {
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
  total_price: number
  discount_price: number
  created_at: string
  updated_at: string
}

export interface ChangeOrderStatus {
  order_id: string
  order_status: number
}

export interface TotalStatusOrder {
  totalWaitConfirmed: number
  totalDelivery: number
  totalSuccess: number
  totalCanceled: number
}

export interface TotalProfitToMonth {
  month: number
  totalQuantity: number
  totalRevenue: number
  totalProfit: number
  totalCost: number
}

export interface TotalDashBoard {
  totalProfit: {
    totalProfit: number
  }
  totalCustomer: number
  totalProduct: number
  totalOrder: number
}
