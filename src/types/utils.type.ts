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
//cú pháp -? loại bỏ key optional
export type NoUnderfinedField<T> = {
  [P in keyof T]-?: NoUnderfinedField<NonNullable<T[P]>>
}
