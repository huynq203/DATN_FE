export interface Role {
  _id: string
  role_name: string
  description: string
  created_at: string
  updated_at: string
}

export interface RoleReq {
  role_name: string
  description: string
}

export interface RoleUpdateReq {
  role_id: string
  role_name?: string
  description?: string
}
