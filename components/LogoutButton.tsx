"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from "@/lib/supabaseClient";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    if (!isSupabaseBrowserConfigured) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="btn-secondary">
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
