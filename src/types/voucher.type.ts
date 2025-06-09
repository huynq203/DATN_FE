import { StatusType } from 'src/constants/enum'

export interface Voucher {
  _id: string
  name: string
  code: string
  discount: number
  quantity: number
  status: StatusType
  time_start: string
  time_end: string
  created_by: {
    _id: string
    name: string
  }
  created_at: string
  updated_at: string
}

export interface CreateVoucherReq {
  name: string
  code: string
  discount: number
  quantity: number
  time_start: string
  time_end: string
}

export interface UpdateVoucherReq {
  voucher_id: string
  name: string
  code: string
  discount: number
  quantity: number
  time_start: string
  time_end: string
}


