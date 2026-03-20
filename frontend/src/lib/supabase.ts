import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not set — running in offline/mock mode')
}

export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost',
  supabaseAnonKey || 'placeholder',
)
