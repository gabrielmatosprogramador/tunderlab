import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jonlerngyyoyzyzmjymt.supabase.co'
const supabaseKey = 'sb_publishable_14dx9IUgsCyFGpjmTTBjgQ_EWQxyo8G' // Pegue no dashboard do Supabase

export const supabase = createClient(supabaseUrl, supabaseKey)