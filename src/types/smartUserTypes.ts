export interface UserParam {
  PageNumber?: number;
  PageSize?: number;
  Username?: string;
}

export interface UserType {
  id: string;
  lastName: string;
  firstName: string;
  otherName: string;
  phoneNumber: string;
  email: string;
  username: string;
  defaultRole: string;
  userType: string;
  status: string;
  departmentId: string;
  createdDate: string;
  roles: string[];
}

export interface UserResponse {
  data: UserType[];
  totalCount: 176;
  pageNumber: 1;
  pageSize: 10;
  totalPages: 18;
}

export interface DepartmentType {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
}

export interface DepartmentResponse {
  data: DepartmentType[];
}

export interface RolesType {
  id: string;
  name: string;
  description: string;
  normalizedName: string;
  concurrencyStamp: string;
  userCount: number;
  status: boolean;
}

export interface RolesResponse {
  data: RolesType[];
}
