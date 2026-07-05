"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
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
    const { error } = await supabase.auth.resetPasswordForEmail(String(form.get("email") ?? ""), {
      redirectTo: `${window.location.origin}/login`
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent");
  }

  return (
    <section className="container-px section-y">
      <form onSubmit={handleSubmit} className="surface mx-auto max-w-md rounded-md p-6">
        <p className="eyebrow">Password</p>
        <h1 className="mt-3 text-3xl font-black">Reset password.</h1>
        <label className="mt-6 grid gap-2">
          <span className="label">Email</span>
          <input name="email" type="email" required className="field" />
        </label>
        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send reset link
        </button>
      </form>
    </section>
  );
}
