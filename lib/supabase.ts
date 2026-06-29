import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder')) {
    return null as any;
  }

  try {
    return createSupabaseClient(url, key);
  } catch (error) {
    return null as any;
  }
};
