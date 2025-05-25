import { PaymentMethod } from 'src/constants/enum'

export interface Order {
  address: string
  payment_method: number
  total_price: number
  order_details: {
    product_id: string
    quantity: number
    size: number
    color: string
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
