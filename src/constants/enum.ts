export enum CartStatus {
  InCart, // Đã thêm vào giỏ hàng - 0
  Completed, // Đã mua - 1
  Canceled // Đã hủy - 2
}

export enum PaymentMethod {
  COD, // 0 Thanh toán khi nhận hàng
  MOMO, // 1 Thanh toán qua thẻ: MOMO
  VNPAY // 2 Thanh toán qua thẻ: VNPAY
}

export enum VnPayStatus {
  Success = '00',
  Cancel = '24'
}

export enum MediaType {
  Image, // 0
  Video // 1
}

export enum StatusType {
  Inactive,
  Active
}
