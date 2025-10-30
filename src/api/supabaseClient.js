import { createClient } from '@supabase/supabase-js';

/**
 * The Supabase URL, retrieved from environment variables.
 * @type {string}
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/**
 * The Supabase Anon Key, retrieved from environment variables.
 * @type {string}
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Basic validation to ensure environment variables are set.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in your .env file.");
}

/**
 * The configured Supabase client instance.
 * This singleton instance is used for all interactions with the Supabase backend.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
