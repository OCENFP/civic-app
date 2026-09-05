import { createClient } from "@supabase/supabase-js";

// Fall back to placeholders so the app can build without env vars;
// real values must be set in .env.local for auth/data to work.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
);
