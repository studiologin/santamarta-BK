import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ProductGallery } from "@/components/product-gallery";

export const revalidate = 0;

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('slug');
  if (!data) return [];

  return data.map((prod) => ({
    slug: prod.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product || !product.is_active) {
    console.error(`Product not found or inactive for slug: ${slug}`)
    notFound();
  }

  // Find related products (by category, picking up to 4 other active products for now, or you could do a real 'similar_products' relation query later)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, slug, category, image_url")
    .eq("category", product.category)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-slate-100 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-8 w-full">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href={product.category === 'geossinteticos' ? '/geossinteticos' : '/construcao-civil'} className="hover:text-primary transition-colors capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-100">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Gallery (60%) */}
          <div className="lg:col-span-7">
            <ProductGallery
              productName={product.name}
              images={Array.from(new Set([
                product.image_url,
                ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : [])
              ].filter(Boolean) as string[]))}
            />
          </div>

          {/* Content (40%) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4 w-fit font-display">
              Série Especial • {product.id.substring(0, 6).toUpperCase()}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight text-white uppercase font-display">
              {product.name}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/5">
                <span className="material-symbols-outlined text-primary mt-0.5">verified</span>
                <div>
                  <p className="font-bold text-white text-sm">Qualidade Certificada</p>
                  <p className="text-slate-400 text-xs">Produto em conformidade com normas técnicas internacionais.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/5">
                <span className="material-symbols-outlined text-primary mt-0.5">shield</span>
                <div>
                  <p className="font-bold text-white text-sm">Alta Durabilidade</p>
                  <p className="text-slate-400 text-xs">Resistência superior a intempéries e agentes químicos.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`https://wa.me/5571987203123?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o produto: ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary/90 text-[#07121d] py-5 rounded font-bold text-lg transition-all shadow-xl shadow-primary/10 uppercase tracking-widest font-display text-center block"
              >
                Solicitar Orçamento
              </a>
              
              {product.catalog_enabled && product.catalog_url && (
                <a 
                  href={product.catalog_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-transparent border border-white/20 hover:border-primary/50 text-slate-200 py-4 rounded font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  {product.catalog_label || "Baixar Catálogo Técnico (PDF)"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="border-t border-white/10 pt-20 mb-24 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Specs Table */}
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-primary pl-4 uppercase tracking-wider font-display">Ficha Técnica</h3>

            {product.technical_sheet && (Array.isArray(product.technical_sheet) ? product.technical_sheet.length > 0 : Object.keys(product.technical_sheet).length > 0) ? (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#162a3f] text-primary uppercase text-[10px] tracking-widest font-bold font-display">
                    <tr>
                      <th className="px-6 py-4 border-b border-white/10">Propriedade</th>
                      <th className="px-6 py-4 border-b border-white/10">Especificação / Valor</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {(Array.isArray(product.technical_sheet)
                      ? product.technical_sheet
                      : Object.entries(product.technical_sheet)).map((item: any, i: number) => {
                        const key = Array.isArray(product.technical_sheet) ? item.key : item[0];
                        const value = Array.isArray(product.technical_sheet) ? item.value : item[1];
                        return (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 border-b border-white/5 font-bold uppercase tracking-tighter text-xs">{key.replace(/_/g, ' ')}</td>
                            <td className="px-6 py-4 border-b border-white/5">{String(value)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 border border-white/10 rounded-xl bg-white/5 text-slate-400 text-center">
                Nenhuma ficha técnica especificada para este produto.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="border-t border-white/10 pt-20 mb-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-display">Produtos Relacionados</h2>
            <p className="text-slate-400 mt-2">Explore outras soluções para sua obra.</p>
          </div>
          <Link href="/servicos" className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
            Ver Todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts && relatedProducts.map((related) => (
            <Link href={`/produtos/${related.slug}`} key={related.id} className="group cursor-pointer block">
              <div className="aspect-square bg-[#162a3f] rounded-xl overflow-hidden mb-4 border border-white/5 relative flex justify-center items-center">
                {related.image_url ? (
                  <Image
                    src={related.image_url}
                    alt={related.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-slate-500">image</span>
                )}
              </div>
              <h4 className="text-white font-bold group-hover:text-primary transition-colors font-display line-clamp-1">{related.name}</h4>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-tighter">{related.category.replace('-', ' ')}</p>
            </Link>
          ))}

          {(!relatedProducts || relatedProducts.length === 0) && (
            <div className="col-span-full text-slate-500 py-10">
              Nenhum outro produto encontrado na mesma categoria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
