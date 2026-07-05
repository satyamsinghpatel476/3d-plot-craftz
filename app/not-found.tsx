import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-px section-y text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-black">Part not found</h1>
      <p className="mx-auto mt-3 max-w-xl text-forge-steel">This page or product is not available.</p>
      <Link href="/" className="btn-primary mt-8">
        Go home
      </Link>
    </section>
  );
}
