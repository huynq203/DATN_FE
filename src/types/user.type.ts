import { StatusType } from 'src/constants/enum'

export interface User {
  _id: string
  name: string
  phone: string
  email: string
  date_of_birth: string
  address: string
  role: {
    _id: string
    role_name: string
  }
  status: StatusType
  created_by: {
    _id: string
    name: string
  }
  created_at: string
  updated_at: string
}

export interface UserRequest {
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  role_id: string
}

export interface UserUpdateRequest {
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  role_id: {
    _id: string
    role_name: string
  }
  user_id_change: string
}
