 
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

export interface AuthenticatedUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  username: string;
  email: string;
  defaultRole: string;
  userType: string;
  status: string;
  departmentId: string;
  roles: string[];
  createdAt?: string;
}

export interface DateFilter {
  dateFrom: Date | string | undefined;
  dateTo: Date | string | undefined;
}
