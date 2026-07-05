"use client";

import { FormEvent, useState } from "react";
import { Headphones, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function HelpDeskForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/support-tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? "")
      })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Ticket could not be created");
      return;
    }

    event.currentTarget.reset();
    toast.success(`Ticket ${payload.ticket?.id?.slice(0, 8) ?? ""} created`);
  }

  return (
    <form onSubmit={handleSubmit} className="surface rounded-md p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Headphones className="h-6 w-6 text-forge-mint" />
        <h2 className="text-2xl font-black">Create support ticket</h2>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">Name</span>
          <input name="name" required className="field" />
        </label>
        <label className="grid gap-2">
          <span className="label">Email</span>
          <input name="email" required type="email" className="field" />
        </label>
        <label className="grid gap-2">
          <span className="label">Phone</span>
          <input name="phone" className="field" />
        </label>
        <label className="grid gap-2">
          <span className="label">Subject</span>
          <input name="subject" required className="field" />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="label">Message</span>
          <textarea name="message" required rows={5} className="field" />
        </label>
      </div>
      <button disabled={loading} className="btn-primary mt-6">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit ticket
      </button>
    </form>
  );
}
