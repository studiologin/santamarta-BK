import { ProductForm } from "@/components/cms/product-form";
import { createClient } from "@supabase/supabase-js";

export async function generateStaticParams() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseAnonKey) return [];

    // Create base JS client purely to fetch the param slugs without SSR hooks
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data } = await supabase.from('products').select('id');
    if (!data) return [];

    return data.map((prod) => ({
        id: prod.id.toString(),
    }));
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProductForm productId={id} />;
}
