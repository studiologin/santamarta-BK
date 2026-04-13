import { createClient } from "@supabase/supabase-js";

export async function generateStaticParams() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Buscar todos os IDs
    const { data } = await supabase.from('products').select('id');
    if (!data) return [];

    return data.map((prod) => ({
        id: prod.id.toString(),
    }));
}

export default function EditProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
