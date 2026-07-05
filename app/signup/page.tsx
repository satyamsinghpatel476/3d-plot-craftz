"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseBrowserConfigured) {
      toast.error("Supabase environment variables are missing.");
      return;
    }

    setLoading(true);
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: String(form.get("password") ?? ""),
      options: {
        data: {
          full_name: fullName,
          phone
        }
      }
    });

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        phone,
        role: "customer"
      });
    }

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="container-px section-y">
      <form onSubmit={handleSubmit} className="surface mx-auto max-w-md rounded-md p-6">
        <p className="eyebrow">Signup</p>
        <h1 className="mt-3 text-3xl font-black">Create your account.</h1>
        <label className="mt-6 grid gap-2">
          <span className="label">Full name</span>
          <input name="fullName" required className="field" />
        </label>
        <label className="mt-4 grid gap-2">
          <span className="label">Email</span>
          <input name="email" type="email" required className="field" />
        </label>
        <label className="mt-4 grid gap-2">
          <span className="label">Phone</span>
          <input name="phone" className="field" />
        </label>
        <label className="mt-4 grid gap-2">
          <span className="label">Password</span>
          <input name="password" type="password" minLength={8} required className="field" />
        </label>
        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Signup
        </button>
        <p className="mt-5 text-sm text-forge-steel">
          Already registered? <Link href="/login" className="font-semibold text-forge-mint">Login</Link>
        </p>
      </form>
    </section>
  );
}
