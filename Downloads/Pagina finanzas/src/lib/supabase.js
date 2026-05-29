import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Faltan variables de entorno de Supabase. Crea el archivo .env.local');
}

// Clear stale PKCE code from URL before Supabase initializes
if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

export const supabase = createClient(url, key, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
    persistSession: true,
  },
});
