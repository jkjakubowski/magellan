import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type BrowserSupabaseClient = ReturnType<typeof createClientComponentClient>;

let client: BrowserSupabaseClient | null = null;

export const getSupabaseBrowserClient = (): BrowserSupabaseClient | null => {
  if (client) return client;
  if (typeof window === "undefined") {
    return null;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
      );
    }
    return null;
  }
  client = createClientComponentClient({
    supabaseUrl: url,
    supabaseKey: key
  });
  return client;
};
