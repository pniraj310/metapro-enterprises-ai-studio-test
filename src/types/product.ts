export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  role?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  category: string;
  categoryId?: string;
  brand?: string;
  description: string;
  sku?: string;
  stock?: number;
  minOrderQuantity?: number;
  unit?: string;
  specifications: ProductSpecification[];
  applications?: string[];
  image: string;
  images?: string[];
  relatedProductIds?: string[];
  rating?: number;
  ratingCount?: number;
  badge?: string;
  featured?: boolean;
  active?: boolean;
  availability: 'Available' | 'Out of Stock';
  createdAt: string;
  updatedAt?: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  createdAt?: string;
}

export interface BusinessSettingsData {
  id?: number;
  businessName: string;
  whatsAppNumber: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface EnquiryRecord {
  id: number;
  userUid?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  projectType?: string;
  items: { productId: string; name: string; quantity: number; unit?: string; sku?: string; price?: number }[];
  notes?: string;
  status: string;
  createdAt: string;
}

export interface OrderCustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'razorpay' | 'cod' | 'upi' | 'card' | 'whatsapp_po';
  paymentStatus?: 'PAID' | 'PENDING';
  razorpayPaymentId?: string;
  companyName?: string;
  gstin?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customer: OrderCustomerDetails;
  createdAt: string;
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  paymentStatus?: 'PAID' | 'PENDING';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  trackingDocket?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
  method?: string;
  signature_verified: boolean;
  webhook_event_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  refund_id?: string;
  refund_amount?: number;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSettingsInfo {
  provider: string;
  mode: 'test' | 'live';
  modeLabel: string;
  isKeyConfigured: boolean;
  isWebhookConfigured: boolean;
  keyId: string;
  currency: string;
  webhookUrl: string;
  gatewayStatus: string;
}
