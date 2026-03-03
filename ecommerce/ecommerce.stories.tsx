import type { Meta, StoryObj } from "@storybook/react";
import { useCart, useCheckout } from "./model/hooks";
import { ORDER_STATUS_CONFIG, CHECKOUT_STEPS } from "./model/constants";
import type { CartItem } from "./model/types";

const sampleItems: CartItem[] = [
  { productId: "p1", name: "Wireless Headphones", price: 79.99, quantity: 1, image: "" },
  { productId: "p2", name: "USB-C Hub", price: 49.99, quantity: 2, image: "" },
  { productId: "p3", name: "Mechanical Keyboard", price: 149.99, quantity: 1, image: "" },
];

function CartDemo() {
  const { cart, addItem, updateQuantity, removeItem, clearCart, itemCount, isEmpty } = useCart({ taxRate: 0.08 });

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 520 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {sampleItems.map((item) => (
          <button
            key={item.productId}
            onClick={() => addItem(item)}
            style={{ padding: "6px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
          >
            + {item.name}
          </button>
        ))}
        <button onClick={clearCart} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Clear</button>
      </div>

      {isEmpty ? (
        <div style={{ padding: 32, textAlign: "center", color: "#9ca3af", background: "#f9fafb", borderRadius: 8 }}>Cart is empty</div>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>${item.price.toFixed(2)} × {item.quantity}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ width: 28, height: 28, border: "1px solid #d1d5db", borderRadius: 4, background: "white", cursor: "pointer" }}>−</button>
                <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ width: 28, height: 28, border: "1px solid #d1d5db", borderRadius: 4, background: "white", cursor: "pointer" }}>+</button>
                <button onClick={() => removeItem(item.productId)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Subtotal</span><span>${cart.subtotal.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Tax (8%)</span><span>${cart.tax.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 8 }}><span>Total</span><span>${cart.total.toFixed(2)}</span></div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{itemCount} item(s)</div>
          </div>
        </>
      )}
    </div>
  );
}

function CheckoutDemo() {
  const { currentStep, stepIndex, totalSteps, steps, nextStep, prevStep, goToStep, isFirst, isLast } = useCheckout();

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 520 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={s.step} style={{ flex: 1, textAlign: "center" }}>
            <div
              onClick={() => goToStep(s.step)}
              style={{
                height: 4, borderRadius: 2, cursor: "pointer",
                background: i <= stepIndex ? "#3b82f6" : "#e5e7eb",
                marginBottom: 6,
              }}
            />
            <div style={{ fontSize: 12, fontWeight: i === stepIndex ? 700 : 400, color: i <= stepIndex ? "#3b82f6" : "#9ca3af" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 32, background: "#f9fafb", borderRadius: 8, textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{["🛒", "📦", "💳", "📋", "✅"][stepIndex]}</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Step {stepIndex + 1}: {steps[stepIndex].label}</div>
        <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>This is the {currentStep} step content area</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={prevStep} disabled={isFirst} style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", cursor: isFirst ? "default" : "pointer", opacity: isFirst ? 0.4 : 1 }}>← Back</button>
        <button onClick={nextStep} disabled={isLast} style={{ padding: "8px 16px", background: isLast ? "#22c55e" : "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: isLast ? "default" : "pointer", opacity: isLast ? 0.6 : 1 }}>{isLast ? "Done ✓" : "Next →"}</button>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Modules/Ecommerce",
  parameters: { layout: "padded" },
};
export default meta;

export const Cart: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useCart() — Cart Management</h3>
      <CartDemo />
    </div>
  ),
};

export const CheckoutFlow: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useCheckout() — Step Flow</h3>
      <CheckoutDemo />
    </div>
  ),
};

export const OrderStatuses: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Order Status Config</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
          <div key={key} style={{ padding: "6px 14px", borderRadius: 16, background: "#f3f4f6", fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{config.label}</span> <span style={{ color: "#9ca3af" }}>({config.color})</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
