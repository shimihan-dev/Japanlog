import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://rkmcfsjwrutbmgckmslr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_22A6KoYwx79-v4aHO4CFMw_C2DoZNZp";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl !== "https://your-supabase-project-url.supabase.co"
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
