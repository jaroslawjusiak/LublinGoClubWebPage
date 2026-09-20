import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns a configured Supabase client, or `null` when the required public
 * environment variables are not present (e.g. local build, unit tests).
 *
 * Only public (anon) credentials may live in the browser bundle.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    console.warn(
      '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. News will render empty.',
    );
    return null;
  }

  return createClient(url, anonKey);
}
