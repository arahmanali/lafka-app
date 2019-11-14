export interface IResponse {
  status: number,
  body: {
    token?: string
  }
}

export interface IValidateResponse {
  status: number,
  body: boolean
}

export interface IResponseError {
  message: string
}