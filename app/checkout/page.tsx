import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout"
};

export default function CheckoutPage() {
  return (
    <section className="container-px section-y">
      <CheckoutForm />
    </section>
  );
}
