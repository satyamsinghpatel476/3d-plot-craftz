"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from "@/lib/supabaseClient";

export default function LoginPage() {
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
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? "")
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged in");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="container-px section-y">
      <form onSubmit={handleSubmit} className="surface mx-auto max-w-md rounded-md p-6">
        <p className="eyebrow">Login</p>
        <h1 className="mt-3 text-3xl font-black">Welcome back.</h1>
        <label className="mt-6 grid gap-2">
          <span className="label">Email</span>
          <input name="email" type="email" required className="field" />
        </label>
        <label className="mt-4 grid gap-2">
          <span className="label">Password</span>
          <input name="password" type="password" required className="field" />
        </label>
        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Login
        </button>
        <div className="mt-5 flex justify-between text-sm">
          <Link href="/signup" className="font-semibold text-forge-mint">Create account</Link>
          <Link href="/forgot-password" className="font-semibold text-forge-mint">Forgot password?</Link>
        </div>
      </form>
    </section>
  );
}
