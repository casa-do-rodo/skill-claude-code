import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database, "facioflow_dashboard">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context — set called from a place that can't mutate cookies, OK
          }
        },
      },
      db: { schema: "facioflow_dashboard" },
    }
  );
}
