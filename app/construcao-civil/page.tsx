"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ConstructionPage() {
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<any>({})
  const ITEMS_PER_PAGE = 8

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [productsRes, pageRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("category", "construcao-civil")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("pages")
          .select("content")
          .eq("slug", "construcao-civil")
          .single()
      ]);

      if (productsRes.data) {
        setProducts(productsRes.data)
      }
      if (pageRes.data) {
        setPageContent(pageRes.data.content || {})
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const categories = ["Todos", "Proteções Coletivas", "Geral", "Infraestrutura"]

  // Simulates front-end categorization based on keywords in usage_application or name
  // Since we don't have granular subcategories in DB right now.
  const filteredProducts = activeFilter === "Todos"
    ? products
    : products.filter(p => {
      const text = `${p.name} ${p.usage_application}`.toLowerCase()
      if (activeFilter === "Proteções Coletivas") return text.includes("proteção") || text.includes("rede") || text.includes("tela") || text.includes("periferia")
      if (activeFilter === "Infraestrutura") return text.includes("infraestrutura") || text.includes("drenagem")
      if (activeFilter === "Geral") return text.includes("geral") || text.includes("ferramenta") || text.includes("corda") || text.includes("tubo")
      return false;
    })

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image
            alt="Industrial construction site with high cranes"
            className="object-cover grayscale brightness-[0.35] contrast-125"
            src="/images/products/construction_hero_1772752868726.png"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-t from-background-dark via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-12 text-primary text-xs font-bold tracking-[0.4em] uppercase">
            <Link className="hover:text-white transition-colors" href="/">Home</Link>
            <span className="text-[8px]">●</span>
            <span className="text-primary">Construção Civil</span>
          </div>
          <div className="max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight text-white mb-6 uppercase font-industrial leading-[1.05] opacity-95 drop-shadow-lg">
              {pageContent.hero_title ? (
                <span dangerouslySetInnerHTML={{ __html: pageContent.hero_title.replace('Civil', '<span class="text-primary">Civil</span>') }} />
              ) : (
                <>
                  Construção <br />
                  <span className="text-primary">Civil</span>
                </>
              )}
            </h1>
            <div className="h-1 w-24 bg-primary mb-10"></div>
            <div className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed drop-shadow">
              {pageContent.hero_subtitle ? (
                <span dangerouslySetInnerHTML={{ __html: pageContent.hero_subtitle }} />
              ) : (
                <p>
                  Excelência em soluções de segurança e infraestrutura para grandes obras.<br />
                  Equipamentos de alta performance com certificação internacional.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Product Grid Section */}
      <section className="px-4 lg:px-20 py-8">
        {(() => {
          const totalItems = filteredProducts.length;
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          // Calculate visible pages for pagination
          const getVisiblePages = () => {
            const delta = 1;
            const range = [];
            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
              range.push(i);
            }
            if (currentPage - delta > 2) range.unshift("...");
            if (currentPage + delta < totalPages - 1) range.push("...");
            range.unshift(1);
            if (totalPages > 1) range.push(totalPages);
            return range;
          };

          return (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveFilter(cat);
                        setCurrentPage(1);
                      }}
                      className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg transition-all ${activeFilter === cat
                        ? "border border-primary text-primary bg-transparent shadow-primary/10 hover:bg-primary hover:text-background-dark"
                        : "bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-medium hover:bg-primary/10 hover:text-primary transition-colors dark:bg-surface-dark border border-transparent shadow-none"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <span className="material-symbols-outlined">filter_list</span>
                  <p>Mostrando {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} de {totalItems} resultado{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Carregando catálogo...</span>
                  </div>
                ) : (
                  paginatedProducts.map((product) => (
                    <Link key={product.id} href={`/produtos/${product.slug}`} className="group flex flex-col bg-slate-100 dark:bg-white/5 border border-primary/10 rounded-lg overflow-hidden transition-all hover:border-primary/40 dark:bg-surface-dark hover:-translate-y-1 duration-300">
                      <div className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-slate-900 flex items-center justify-center">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="mb-1">
                          <span className="text-primary text-[10px] font-bold uppercase tracking-widest font-display">Construção Civil</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base lg:text-lg mb-2 font-display">{product.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 line-clamp-2">{product.description}</p>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-primary/10">
                          <span className="text-slate-400 text-[10px] font-medium uppercase italic">Destaque</span>
                          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-bold uppercase tracking-tight font-display group/btn">
                            Ver Detalhes <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward_ios</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))
                )}

                {!loading && paginatedProducts.length === 0 && (
                  <div className="col-span-full text-center py-16 text-slate-500">
                    Nenhum produto encontrado na categoria selecionada.
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {!loading && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="size-10 flex items-center justify-center border border-white/10 dark:border-primary/20 bg-white/5 text-slate-400 hover:text-primary hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-bold text-sm rounded-sm"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>

                  {getVisiblePages().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
                      disabled={page === "..."}
                      className={`size-10 flex items-center justify-center font-bold text-sm rounded-sm transition-all ${page === currentPage
                        ? "bg-primary text-background-dark shadow-lg shadow-primary/20"
                        : page === "..."
                          ? "text-slate-600 bg-transparent border-none cursor-default"
                          : "border border-white/10 dark:border-primary/10 bg-white/5 text-slate-400 hover:text-primary hover:border-primary/40"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="size-10 flex items-center justify-center border border-white/10 dark:border-primary/20 bg-white/5 text-slate-400 hover:text-primary hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-bold text-sm rounded-sm"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* Featured Showcase */}
      <section className="px-4 lg:px-20 py-16">
        <div className="bg-slate-100 dark:bg-white/5 border border-primary/10 rounded-xl overflow-hidden flex flex-col lg:flex-row items-stretch group hover:border-primary/30 transition-all duration-500">
          <div className="lg:w-1/2 min-h-[300px] relative overflow-hidden">
            <Image
              src="/images/products/safety_net_construction_h_view_top_angle_1772753048463.png"
              alt="Close up of construction site safety mesh"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="lg:w-1/2 p-10 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl text-primary">verified_user</span>
            </div>
            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded w-fit uppercase mb-4 tracking-wider font-display">Destaque do Mês</span>
            <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold mb-4 font-display">Sistemas de Rede de Segurança Sub-Laje</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed relative z-10">
              Nossas redes de segurança são fabricadas com poliamida de alta tenacidade, garantindo a máxima resistência mecânica e durabilidade contra raios UV. O sistema ideal para projetos que priorizam a vida sem comprometer a agilidade da obra.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">verified</span>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 text-sm font-bold font-display">Certificado NR-18</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Conformidade total</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">shield</span>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 text-sm font-bold font-display">Alta Durabilidade</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Resistente a intempéries</p>
                </div>
              </div>
            </div>
            <button className="bg-primary text-[#0A192A] font-bold px-8 py-4 rounded hover:bg-primary/90 transition-all uppercase tracking-tighter text-sm w-fit font-display shadow-lg shadow-primary/20 hover:shadow-primary/40">
              Consultar Especialista
            </button>
          </div>
        </div>
      </section >
    </div >
  )
}
