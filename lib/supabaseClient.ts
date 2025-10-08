import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const getSupabaseBrowserClient = () => {
  if (client) return client;
  if (typeof window === "undefined") {
    throw new Error("Supabase client is only available in the browser.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }
  client = createClientComponentClient({
    supabaseUrl: url,
    supabaseKey: key
  });
  return client;
};
