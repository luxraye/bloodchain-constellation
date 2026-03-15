import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

console.log('[Supabase] Initializing with URL:', supabaseUrl ? 'SET' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — auth will not work until .env.local is populated.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
