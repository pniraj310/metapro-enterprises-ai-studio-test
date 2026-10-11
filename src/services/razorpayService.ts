import { PaymentRecord, PaymentSettingsInfo } from '../types/product';
import { apiUrl, getAuthHeaders } from './api';

export interface RazorpayPaymentSuccessData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  method: 'upi' | 'card' | 'netbanking' | 'wallet' | string;
  order_id?: string;
}

export interface CreateOrderPayload {
  items: Array<{ product?: { price: number }; price?: number; quantity: number }>;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    companyName?: string;
    gstin?: string;
  };
  buyNowProduct?: {
    product: { price: number };
    quantity: number;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  paymentId: string;
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  amountPaise: number;
  currency: string;
  keyId: string;
  mode: 'test' | 'live';
  modeLabel: string;
  isRealRazorpayOrder: boolean;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface VerifyPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  order_id?: string;
  payment_id?: string;
  method?: string;
  amount?: number;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment?: PaymentRecord;
  error?: string;
}

/**
 * Dynamically loads the official Razorpay Checkout SDK
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load external Razorpay checkout.js script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Step 1: Call backend to create Razorpay Order
 * Backend validates items, prices, calculates server-side amount, creates local payment record,
 * and calls Razorpay Orders API.
 */
export async function createRazorpayOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const response = await fetch(apiUrl('/api/payments/create-order'), {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to create payment order.' }));
    throw new Error(errorData.error || 'Server error creating Razorpay order');
  }

  return response.json();
}

/**
 * Step 2: Call backend to verify HMAC signature
 * Verifies razorpay_order_id + "|" + razorpay_payment_id against RAZORPAY_KEY_SECRET.
 */
export async function verifyRazorpayPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
  const response = await fetch(apiUrl('/api/payments/verify'), {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Verification network failed' }));

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed on backend.');
  }

  return data;
}

/**
 * Admin: Fetch payments list with status filter and search query
 */
export async function fetchAdminPayments(status: string = 'all', search: string = ''): Promise<{
  payments: PaymentRecord[];
  totalCount: number;
  totalPaidAmount: number;
  currency: string;
}> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search && search.trim()) params.append('search', search.trim());

  const response = await fetch(apiUrl(`/api/admin/payments?${params.toString()}`), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch payments records');
  }
  return response.json();
}

/**
 * Admin: Request payment refund through backend Razorpay API
 */
export async function requestPaymentRefund(paymentId: string, amount?: number, reason?: string): Promise<{
  success: boolean;
  message: string;
  refundId: string;
  payment: PaymentRecord;
}> {
  const response = await fetch(apiUrl(`/api/admin/payments/${encodeURIComponent(paymentId)}/refund`), {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, reason }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Refund execution failed');
  }
  return data;
}

/**
 * Admin: Fetch Payment Gateway Settings & status
 */
export async function fetchPaymentSettings(): Promise<PaymentSettingsInfo> {
  const response = await fetch(apiUrl('/api/admin/payment-settings'), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch payment settings');
  }
  return response.json();
}

/**
 * Generates mock payment ID for fallback sandbox simulation
 */
export const generatePaymentId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'pay_';
  for (let i = 0; i < 14; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
