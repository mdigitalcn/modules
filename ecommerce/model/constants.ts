import type { CheckoutStep, OrderStatus } from "./types";

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "warning" },
  confirmed: { label: "Confirmed", color: "info" },
  processing: { label: "Processing", color: "info" },
  shipped: { label: "Shipped", color: "primary" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
  refunded: { label: "Refunded", color: "default" },
};

export const CHECKOUT_STEPS: { step: CheckoutStep; label: string }[] = [
  { step: "cart", label: "Cart" },
  { step: "shipping", label: "Shipping" },
  { step: "payment", label: "Payment" },
  { step: "review", label: "Review" },
  { step: "confirmation", label: "Done" },
];

export const CART_STORAGE_KEY = "mdigitalcn_cart";
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_TAX_RATE = 0;
