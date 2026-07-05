import crypto from "crypto";
import Razorpay from "razorpay";

export function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured.");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

export async function createRazorpayOrder(amount: number, receipt: string) {
  const razorpay = getRazorpayClient();
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
    payment_capture: true
  });
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay secret is not configured.");
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return expected === razorpaySignature;
}
