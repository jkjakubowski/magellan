import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type BrowserSupabaseClient = ReturnType<typeof createClientComponentClient>;

let client: BrowserSupabaseClient | null = null;
let initPromise: Promise<BrowserSupabaseClient> | null = null;

const resolveSupabaseEnv = async (): Promise<{
  supabaseUrl: string;
  supabaseAnonKey: string;
}> => {
  const response = await fetch("/api/public-env");
  if (!response.ok) {
    throw new Error("Unable to retrieve Supabase configuration from the server.");
  }
  const data = await response.json();
  const { supabaseUrl, supabaseAnonKey } = data ?? {};

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return { supabaseUrl, supabaseAnonKey };
};

const createBrowserClient = async (): Promise<BrowserSupabaseClient> => {
  if (client) return client;
  const { supabaseUrl, supabaseAnonKey } = await resolveSupabaseEnv();
  client = createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey
  });
  return client;
};

export const ensureSupabaseBrowserClient = async (): Promise<BrowserSupabaseClient> => {
  if (client) return client;
  if (!initPromise) {
    initPromise = createBrowserClient().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
};

export const getSupabaseBrowserClient = (): BrowserSupabaseClient | null => client;

export const useSupabaseBrowser = (): BrowserSupabaseClient | null => {
  const [instance, setInstance] = useState<BrowserSupabaseClient | null>(client);

  useEffect(() => {
    if (client) {
      setInstance(client);
      return;
    }

    let isMounted = true;

    ensureSupabaseBrowserClient()
      .then((supabaseClient) => {
        if (isMounted) {
          setInstance(supabaseClient);
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to initialise Supabase client", error);
        }
        if (isMounted) {
          setInstance(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return instance;
};

export const useSupabaseClient = useSupabaseBrowser;
