import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      // Return a stub client that returns empty data — allows build
      // to succeed when env vars are not yet configured
      return createSupabaseClient(
        "https://placeholder.supabase.co",
        "placeholder-key"
      );
    }

    _client = createSupabaseClient(url, key);
  }
  return _client;
}
