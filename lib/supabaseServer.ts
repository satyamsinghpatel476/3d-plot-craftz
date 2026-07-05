import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const isSupabaseServerConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function createServerSupabaseClient() {
  if (!isSupabaseServerConfigured) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components cannot always write cookies; middleware handles refresh.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Server Components cannot always write cookies; middleware handles refresh.
          }
        }
      }
    }
  );
}

export function createServiceSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createServiceSupabaseClient() ?? createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  if (profile.role !== "admin") {
    redirect("/dashboard");
  }
  return profile;
}
