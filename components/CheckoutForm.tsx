"use client";

import { FormEvent, useState } from "react";
import { CreditCard, Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length) {
      toast.error("Add at least one item before checkout.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const paymentMethod = String(form.get("paymentMethod") ?? "razorpay");
    setLoading(true);

    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
        pincode: String(form.get("pincode") ?? ""),
        deliveryNotes: String(form.get("deliveryNotes") ?? ""),
        paymentMethod,
        items: items.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
          price: line.product.price
        }))
      })
    });

    const orderPayload = await orderResponse.json();

    if (!orderResponse.ok) {
      setLoading(false);
      toast.error(orderPayload.error ?? "Order could not be created");
      return;
    }

    if (paymentMethod !== "razorpay") {
      clearCart();
      setLoading(false);
      toast.success(paymentMethod === "cod" ? "COD order placed" : "Quote request created");
      return;
    }

    const ready = await loadRazorpayScript();
    if (!ready) {
      setLoading(false);
      toast.error("Razorpay checkout failed to load");
      return;
    }

    const paymentResponse = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderPayload.order.id, amount: orderPayload.order.total_amount })
    });
    const paymentPayload = await paymentResponse.json();

    if (!paymentResponse.ok) {
      setLoading(false);
      toast.error(paymentPayload.error ?? "Payment order could not be created");
      return;
    }

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key) {
      setLoading(false);
      toast.error("NEXT_PUBLIC_RAZORPAY_KEY_ID is missing");
      return;
    }

    const checkout = new window.Razorpay!({
      key,
      amount: paymentPayload.razorpayOrder.amount,
      currency: "INR",
      name: "PartForge 3D",
      description: orderPayload.order.order_number,
      order_id: paymentPayload.razorpayOrder.id,
      handler: async (response: Record<string, string>) => {
        const verifyResponse = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderPayload.order.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        });

        const verifyPayload = await verifyResponse.json();
        setLoading(false);

        if (!verifyResponse.ok) {
          toast.error(verifyPayload.error ?? "Payment verification failed");
          return;
        }

        clearCart();
        toast.success("Payment verified and order placed");
      },
      prefill: {
        name: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        contact: String(form.get("phone") ?? "")
      },
      theme: {
        color: "#2fbf9b"
      },
      modal: {
        ondismiss: () => setLoading(false)
      }
    });

    checkout.open();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="surface rounded-md p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-forge-mint" />
          <h1 className="text-2xl font-black">Checkout</h1>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["fullName", "Full name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["city", "City"],
            ["state", "State"],
            ["pincode", "Pincode"]
          ].map(([name, label]) => (
            <label key={name} className="grid gap-2">
              <span className="label">{label}</span>
              <input name={name} required className="field" type={name === "email" ? "email" : "text"} />
            </label>
          ))}
          <label className="grid gap-2 sm:col-span-2">
            <span className="label">Address</span>
            <textarea name="address" required rows={3} className="field" />
          </label>
          <label className="grid gap-2 sm:col-span-2">
            <span className="label">Delivery notes</span>
            <textarea name="deliveryNotes" rows={3} className="field" />
          </label>
          <label className="grid gap-2 sm:col-span-2">
            <span className="label">Payment method</span>
            <select name="paymentMethod" className="field">
              <option value="razorpay">Razorpay UPI/Card/Net Banking/Wallet</option>
              <option value="cod">Cash on Delivery</option>
              <option value="quote">Manual quote request</option>
            </select>
          </label>
        </div>
      </div>

      <aside className="surface h-fit rounded-md p-5">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-5 w-5 text-forge-mint" />
          <h2 className="font-bold">Order summary</h2>
        </div>
        <div className="mt-5 space-y-3">
          {items.map((line) => (
            <div key={line.product.id} className="flex justify-between gap-3 text-sm">
              <span>{line.product.name} × {line.quantity}</span>
              <span className="font-semibold">{formatCurrency(line.product.price * line.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-black/10 pt-5 dark:border-white/10">
          <div className="flex justify-between text-sm text-forge-steel">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-black">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
        <button disabled={loading || items.length === 0} className="btn-primary mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Place order
        </button>
      </aside>
    </form>
  );
}
