import type { Product, Order, Cart, Address, Invoice } from "./types";

export function createEcommerceApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...config.headers?.(), ...options?.headers } });
    if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.message || `HTTP ${res.status}`); }
    return res.json();
  }

  return {
    // Products
    getProducts: (params?: Record<string, string>) => { const url = new URL(`${config.baseUrl}/products`, window.location.origin); if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v)); return request<{ items: Product[]; total: number }>(url.pathname + url.search); },
    getProduct: (id: string) => request<Product>(`/products/${id}`),

    // Cart
    getCart: () => request<Cart>("/cart"),
    addToCart: (productId: string, quantity: number, variantId?: string) => request<Cart>("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity, variantId }) }),
    updateCartItem: (productId: string, quantity: number) => request<Cart>(`/cart/items/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity }) }),
    removeFromCart: (productId: string) => request<Cart>(`/cart/items/${productId}`, { method: "DELETE" }),
    clearCart: () => request<Cart>("/cart", { method: "DELETE" }),

    // Orders
    getOrders: (params?: Record<string, string>) => { const url = new URL(`${config.baseUrl}/orders`, window.location.origin); if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v)); return request<{ items: Order[]; total: number }>(url.pathname + url.search); },
    getOrder: (id: string) => request<Order>(`/orders/${id}`),
    createOrder: (data: { shippingAddress: Address; billingAddress: Address; paymentMethod: string }) => request<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),

    // Invoices
    getInvoices: () => request<{ items: Invoice[]; total: number }>("/invoices"),
    getInvoice: (id: string) => request<Invoice>(`/invoices/${id}`),
  };
}

export type EcommerceApi = ReturnType<typeof createEcommerceApi>;
