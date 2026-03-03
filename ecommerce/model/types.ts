export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  sku: string;
  stock: number;
  status: "active" | "draft" | "archived";
  variants?: ProductVariant[];
  metadata?: Record<string, unknown>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  attributes: Record<string, string>;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  number: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  paidAt?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type CheckoutStep = "cart" | "shipping" | "payment" | "review" | "confirmation";

export interface EcommerceConfig {
  baseUrl: string;
  currency?: string;
  taxRate?: number;
}
