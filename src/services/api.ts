/**
 * MetaPro Enterprises — Centralized API Client & Configuration
 * 
 * Production Backend API: https://metapro-enterprises-api.onrender.com
 * Supports dynamic VITE_API_BASE_URL override, safe local development,
 * and automatic production routing on Vercel deployments.
 */

import { Product, ProductFormData, Order, OrderCustomerDetails } from '../types/product';

/**
 * Resolves the API base URL based on runtime environment:
 * 1. Explicit import.meta.env.VITE_API_BASE_URL (if defined and non-empty)
 * 2. If running on Vercel preview/production or custom domain -> https://metapro-enterprises-api.onrender.com
 * 3. Default fallback for local development / AI Studio container -> '' (same-origin relative)
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    // Strip trailing slashes and common accidental placeholders
    const cleaned = envUrl.trim().replace(/[{}]/g, '').replace(/\/+$/, '');
    if (cleaned && !cleaned.includes('API_BASE_URL')) {
      return cleaned;
    }
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // When running on Vercel or production domain, route requests to Render backend
    if (
      hostname.includes('vercel.app') ||
      hostname === 'www.metaproenterprises.in' ||
      hostname === 'metaproenterprises.in' ||
      (!hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('run.app'))
    ) {
      return 'https://metapro-enterprises-api.onrender.com';
    }
  }

  // Local development / AI Studio fullstack dev server
  return '';
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Safely resolves an API endpoint path against the active base URL.
 * Normalizes leading/trailing slashes and handles query strings.
 */
export function apiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!base) {
    return normalizedEndpoint;
  }

  return `${base}${normalizedEndpoint}`;
}

/**
 * Helper to obtain authentication headers from localStorage
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const adminToken = localStorage.getItem('metapro_admin_token');
    const customerToken = localStorage.getItem('metapro_customer_token');
    const token = adminToken || customerToken;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }

  return headers;
}

/**
 * Robust fetch wrapper that guarantees correct URL construction,
 * headers, error normalization, and JSON parsing.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const targetUrl = apiUrl(endpoint);

  const mergedHeaders: Record<string, string> = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(targetUrl, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      errorDetail = errJson.error || errJson.message || JSON.stringify(errJson);
    } catch {
      const errText = await response.text();
      if (errText) errorDetail = errText;
    }
    throw new Error(`API Error (${response.status}): ${errorDetail}`);
  }

  // Return parsed JSON or null for 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * Convenience HTTP method helpers
 */
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { method: 'GET', ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { method: 'DELETE', ...options }),
};

/**
 * Backward compatibility adapter for legacy springBootApi references
 */
export const springBootApi = {
  products: {
    getAll: () => api.get<Product[]>('/api/products'),
    getById: (id: string) => api.get<Product>(`/api/products/${encodeURIComponent(id)}`),
    create: (data: ProductFormData) => api.post<Product>('/api/products', data),
    update: (id: string, data: Partial<ProductFormData>) =>
      api.put<Product>(`/api/products/${encodeURIComponent(id)}`, data),
    delete: (id: string) => api.delete<{ success: boolean }>(`/api/products/${encodeURIComponent(id)}`),
    toggleAvailability: (id: string) =>
      api.patch<Product>(`/api/products/${encodeURIComponent(id)}/availability`),
  },
  orders: {
    create: (orderPayload: { customer: OrderCustomerDetails; items: { productId: string; quantity: number }[] }) =>
      api.post<Order>('/api/orders', orderPayload),
    getCustomerOrders: () => api.get<Order[]>('/api/orders/my-orders'),
    getAllOrders: () => api.get<Order[]>('/api/admin/payments'),
    updateStatus: (id: string, status: string) =>
      api.patch<Order>(`/api/orders/${encodeURIComponent(id)}/status`, { status }),
  },
  auth: {
    adminLogin: (credentials: { username: string; password: string }) =>
      api.post<{ token: string; username: string }>('/api/auth/login', credentials),
    customerLogin: (credentials: { phoneOrEmail: string; password: string }) =>
      api.post<{ token: string; user: any }>('/api/auth/login', credentials),
    customerRegister: (userData: any) =>
      api.post<{ token: string; user: any }>('/api/users/sync', userData),
  },
};
export const USE_SPRING_BOOT_API =
  typeof import.meta.env.VITE_USE_SPRING_BOOT !== 'undefined'
    ? String(import.meta.env.VITE_USE_SPRING_BOOT).toLowerCase() === 'true'
    : true;
