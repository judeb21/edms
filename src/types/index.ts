/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorObject {
  [key: string]: string[] | string[][] | any;
}

interface ResponseErrorData {
  message?: string;
  error?: ErrorObject;
}

export interface ExtendedFetchBaseQueryError {
  data: ResponseErrorData;
  status: number | string;
  message?: string;
}