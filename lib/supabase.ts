import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export const createClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder')) {
    return null as any;
  }

  try {
    supabaseInstance = createSupabaseClient(url, key);
    return supabaseInstance;
  } catch (error) {
    return null as any;
  }
};
