import {
  DepartmentResponse,
  RolesType,
  UserParam,
  UserResponse,
} from "@/types/smartUserTypes";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SMART_USER_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  noCache?: boolean
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    cache: noCache ? "no-store" : "default",
    headers,
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

const buildQueryString = (params: UserParam): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString() ? `?${queryParams.toString()}` : "";
};

export const smartUserService = {
  async getAllUsers(params: UserParam): Promise<UserResponse> {
    const queryString = params ? buildQueryString(params as UserParam) : "";
    const { data } = await axios.get(
      `${API_BASE_URL}/administration/users${queryString}`
    );
    return data?.data;
  },

  //    async fetchWorkflows () =>
  //     apiFetch<WorkflowTypes[]>("/admin/workflows", { method: "GET" }, true);

  async getAllDepartments() {
    try {
      return await apiFetch<DepartmentResponse>(`/administration/department`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please try again.");
    }
  },

  async getAllRoles(): Promise<RolesType[]> {
    const { data } = await axios.get(`${API_BASE_URL}/administration/roles`);
    return data?.data;
  },
};
