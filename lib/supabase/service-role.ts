import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Service Role client — bypasses RLS completely.
 *
 * ONLY import this in Server Actions and Route Handlers.
 * Never in Client Components. The SUPABASE_SERVICE_ROLE_KEY
 * has no NEXT_PUBLIC_ prefix and never reaches the browser.
 */
export function createServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
