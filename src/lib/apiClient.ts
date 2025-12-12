// lib/api-client.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { QueryClient } from "@tanstack/react-query";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_COOKIE_NAME = "cred-crm-ticket-tok";

// Logout helper
const handleLogout = () => {
  // Redirect to home page
  if (typeof window !== "undefined") {
    // Call logout API route to clear cookies
    fetch("/api/logout", { method: "POST" }).then(() => {
      window.location.href = "/login";
    });
  }
};

// Custom error class for authentication errors
export class AuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// Client-side apiFetch - routes through Next.js API proxy
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Route all requests through our Next.js API proxy
  // This allows the server to read the httpOnly cookie
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

  // Handle 401/403 - Authentication errors
  if (res.status === 401 || res.status === 403) {
    handleLogout();
    throw new AuthError("Authentication failed", res.status);
  }

  // Handle other errors
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  return res.json();
}

// Configure QueryClient with retry logic
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors (401/403)
        if (error instanceof AuthError) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors (401/403)
        if (error instanceof AuthError) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export const authenticatedAxios: AxiosInstance = axios.create({
  baseURL: "/", // Routes through our proxy
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Transform axios config to proxy format
authenticatedAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Extract the actual endpoint (remove any base URL if present)
    let endpoint = config.url || "";

    // If the URL includes the API_BASE_URL, extract just the endpoint
    if (endpoint.includes("http")) {
      try {
        const url = new URL(endpoint);
        endpoint = url.pathname + url.search;
      } catch (e) {
        // If URL parsing fails, use as is
        console.log(e);
      }
    }

    // Store original config in a way the proxy can use
    const proxyData = {
      endpoint,
      method: config.method?.toUpperCase() || "GET",
      body: config.data,
      headers: config.headers
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
        : {},
    };

    // Transform to POST request to proxy
    config.method = "POST";
    config.url = "/api/proxy-axios";
    config.data = proxyData;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401/403 and extract data properly
authenticatedAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // The proxy returns the backend data directly in response.data
    // Keep the response structure intact for error handling
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;

    // Handle authentication errors (401/403)
    if (status === 401 || status === 403) {
      handleLogout();
      return Promise.reject(new AuthError("Authentication failed", status));
    }

    // For other errors, preserve the error structure
    // so error.response.data.message works in your code
    return Promise.reject(error);
  }
);

// Configure axios to retry on non-auth errors
axios.defaults.timeout = 30000;

// Helper functions
export const authHelpers = {
  logout: () => {
    handleLogout();
  },
};
