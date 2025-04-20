export interface ResponseApi<Data> {
  message: string
  data?: Data
}

export interface ResponseApiError {
  message: string
  errors?: {
    [key: string]: {
      type: string
      value: string
      msg: string
      location: string
      path: string
    }
  }
}

export interface ResponseApiErrorWithStatus {
  message: string
}
