import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Manca la variabile d\'ambiente VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Manca la variabile d\'ambiente VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getAuthenticatedClient = (accessToken?: string) => {
  if (!accessToken) return supabase;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};

export default supabase;