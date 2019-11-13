export interface IResponse {
  status: number,
  body: {
    token: string
  }
}

export interface IResponseError {
  message: string
}