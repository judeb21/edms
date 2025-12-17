import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { QueryClient } from "@tanstack/react-query";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_COOKIE_NAME = "cred-crm-ticket-tok";

const handleLogout = () => {
  if (typeof window !== "undefined") {
    fetch("/api/logout", { method: "POST" }).then(() => {
      window.location.href = "/login";
    });
  }
};

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`/api/proxy`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint,
      method: options?.method || "GET",
      body: options?.body,
      headers: options?.headers,
    }),
  });

  if (res.status === 401 || res.status === 403) {
    handleLogout();
    throw new AuthError("Authentication failed", res.status);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  return res.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof AuthError) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 1,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof AuthError) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export const authenticatedAxios: AxiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

authenticatedAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let endpoint = config.url || "";

    if (endpoint.includes("http")) {
      try {
        const url = new URL(endpoint);
        endpoint = url.pathname + url.search;
      } catch (e) {
        console.log(e);
      }
    }

    const isFormData = config.data instanceof FormData;

    if (isFormData) {
      // Use separate proxy endpoint for FormData
      config.url = "/api/proxy-multipart";
      config.method = "POST";
      
      // Append endpoint and method to FormData
      config.data.append("_endpoint", endpoint);
      config.data.append("_method", config.method?.toUpperCase() || "POST");
      
      // Don't set Content-Type - let browser set it with boundary
      delete config.headers["Content-Type"];
    } else {
      // JSON requests - use regular proxy
      const customHeaders = config.headers
        ? Object.fromEntries(
            Object.entries(config.headers).filter(
              ([key]) =>
                key !== "Content-Type" &&
                key !== "common" &&
                key !== "delete" &&
                key !== "get" &&
                key !== "head" &&
                key !== "post" &&
                key !== "put" &&
                key !== "patch"
            )
          )
        : {};

      const proxyData = {
        endpoint,
        method: config.method?.toUpperCase() || "GET",
        body: config.data,
        headers: customHeaders,
      };

      config.method = "POST";
      config.url = "/api/proxy-axios";
      config.data = proxyData;
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authenticatedAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      handleLogout();
      return Promise.reject(new AuthError("Authentication failed", status));
    }

    return Promise.reject(error);
  }
);

axios.defaults.timeout = 30000;

export const authHelpers = {
  logout: () => {
    handleLogout();
  },
};
