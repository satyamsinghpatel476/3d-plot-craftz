"use client";

import { useState } from "react";
import { toast } from "sonner";

export function AdminStatusSelect({
  id,
  type,
  initialStatus,
  options
}: {
  id: string;
  type: "order" | "ticket";
  initialStatus: string;
  options: string[];
}) {
  const [status, setStatus] = useState(initialStatus);

  async function updateStatus(nextStatus: string) {
    setStatus(nextStatus);
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, status: nextStatus })
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus(initialStatus);
      toast.error(payload.error ?? "Status update failed");
      return;
    }

    toast.success("Status updated");
  }

  return (
    <select className="field max-w-44" value={status} onChange={(event) => updateStatus(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}
