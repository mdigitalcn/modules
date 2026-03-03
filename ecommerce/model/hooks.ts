"use client";

import { useState, useCallback, useMemo } from "react";
import type { CartItem, Cart, CheckoutStep } from "./types";
import { CART_STORAGE_KEY, DEFAULT_CURRENCY, DEFAULT_TAX_RATE, CHECKOUT_STEPS } from "./constants";

/** Local cart state with persistence */
export function useCart(options?: { currency?: string; taxRate?: number }) {
  const currency = options?.currency ?? DEFAULT_CURRENCY;
  const taxRate = options?.taxRate ?? DEFAULT_TAX_RATE;

  const [items, setItems] = useState<CartItem[]>(() => {
    try { if (typeof window === "undefined") return []; const raw = localStorage.getItem(CART_STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems)); } catch {}
  }, []);

  const addItem = useCallback((item: CartItem) => {
    persist(items.map((i) => i.productId === item.productId && i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i).concat(items.some((i) => i.productId === item.productId && i.variantId === item.variantId) ? [] : [item]));
  }, [items, persist]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) return persist(items.filter((i) => i.productId !== productId));
    persist(items.map((i) => i.productId === productId ? { ...i, quantity } : i));
  }, [items, persist]);

  const removeItem = useCallback((productId: string) => persist(items.filter((i) => i.productId !== productId)), [items, persist]);
  const clearCart = useCallback(() => persist([]), [persist]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const tax = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const cart: Cart = { items, subtotal, tax, shipping: 0, total, currency };

  return { cart, addItem, updateQuantity, removeItem, clearCart, itemCount, isEmpty: items.length === 0 };
}

/** Checkout step management */
export function useCheckout() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const stepIndex = CHECKOUT_STEPS.findIndex((s) => s.step === currentStep);

  const nextStep = useCallback(() => {
    const next = CHECKOUT_STEPS[stepIndex + 1];
    if (next) setCurrentStep(next.step);
  }, [stepIndex]);

  const prevStep = useCallback(() => {
    const prev = CHECKOUT_STEPS[stepIndex - 1];
    if (prev) setCurrentStep(prev.step);
  }, [stepIndex]);

  const goToStep = useCallback((step: CheckoutStep) => setCurrentStep(step), []);

  return {
    currentStep,
    stepIndex,
    totalSteps: CHECKOUT_STEPS.length,
    steps: CHECKOUT_STEPS,
    nextStep,
    prevStep,
    goToStep,
    isFirst: stepIndex === 0,
    isLast: stepIndex === CHECKOUT_STEPS.length - 1,
  };
}
