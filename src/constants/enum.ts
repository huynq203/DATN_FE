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
export enum PaymentStatus {
  Unpaid, // Chưa thanh toán - 0
  Paid // Đã thanh toán - 1
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

export enum isDefault {
  False,
  True
}

export enum OrderStatus {
  //Chờ thanh toán
  WaitPayment, // Chờ thanh toán - 0
  //Chờ xác nhận
  WaitConfirmed, // Chờ xác nhận - 1
  //Vận chuyển
  WaitForGetting, // Chờ lấy hàng - 2
  WaitDelivery, // Chờ giao hàng - 3
  OnDelevery, // Đang giao hàng - 4
  //Hoàn thành
  Success, // Thành công - 5
  //Đã hủy
  Cancel // Đã hủy - 6
}

export enum GenderType {
  Women, // Nữ 0
  Men, // Nam 1
  Unisex //  Tất cả 2
}

export enum TargetType {
  Kid, // Trẻ em 0
  Adult // Người lớn 1
}
