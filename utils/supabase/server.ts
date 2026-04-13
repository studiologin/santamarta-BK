import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ioytminosynrorvzqxwt.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXRtaW5vc3lucm9ydnpxeHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mzg1MTYsImV4cCI6MjA4ODMxNDUxNn0.NggeLY0ju9XOZBpgGwqUwnbQgSgrZQZj7xONOY0cSvI';

    return createSupabaseClient(supabaseUrl, supabaseKey);
}
