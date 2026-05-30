import { createClient, SupabaseClient } from "@supabase/supabase-js";

// NEVER import this in client components
// Lazily initialized to avoid build errors when env vars are empty
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      // Stub client for build time
      return createClient(
        "https://placeholder.supabase.co",
        "placeholder-key"
      );
    }

    _admin = createClient(url, key);
  }
  return _admin;
}

// Backward-compatible alias
export const supabaseAdmin = {
  from: (...args: Parameters<SupabaseClient["from"]>) =>
    getSupabaseAdmin().from(...args),
};
