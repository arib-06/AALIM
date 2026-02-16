// lib/supabase.js
// Browser-safe Supabase client using @supabase/ssr
// Used in Client Components and hooks

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Singleton for convenience in client components
let client;
export function getSupabase() {
  if (!client) client = createClient();
  return client;
}
