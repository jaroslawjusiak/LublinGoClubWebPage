import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null | undefined;

/**
 * Returns a single, cached Supabase client, or `null` when the required public
 * environment variables are not present (e.g. local build, unit tests).
 *
 * Only public (anon) credentials may live in the browser bundle.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    cachedClient = null;
    return null;
  }

  cachedClient = createClient(url, anonKey);
  return cachedClient;
}
