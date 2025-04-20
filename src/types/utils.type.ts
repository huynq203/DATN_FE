export interface SuccessResponseApi<Data> {
  message: string
  result: Data
}

export interface ErrorResponseApi {
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
