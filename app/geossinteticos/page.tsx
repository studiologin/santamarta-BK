"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function GeosyntheticsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageContent, setPageContent] = useState<any>({})
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [productsRes, pageRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("category", "geossinteticos")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("pages")
          .select("content")
          .eq("slug", "geossinteticos")
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

  const categories = [
    { name: "Geomembranas", icon: "layers" },
    { name: "Geotêxteis", icon: "texture" },
    { name: "Geogrelhas", icon: "grid_4x4" },
    { name: "Geocélulas", icon: "hive" },
    { name: "Drenagem", icon: "water_drop" }
  ]

  const filteredProducts = activeCategory
    ? products.filter((p) => {
      const text = `${p.name} ${p.usage_application}`.toLowerCase()
      const cat = activeCategory.toLowerCase()
      if (cat === "geomembranas") return text.includes("geomembrana") || text.includes("pead") || text.includes("pvc")
      if (cat === "geotêxteis") return text.includes("geotêxtil") || text.includes("manta") || text.includes("bidim")
      if (cat === "geogrelhas") return text.includes("geogrelha")
      if (cat === "geocélulas") return text.includes("geocélula")
      if (cat === "drenagem") return text.includes("drenagem") || text.includes("geocomposto") || text.includes("dreno")
      return false
    })
    : products

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image
            alt="Industrial construction site with heavy machinery and geosynthetics"
            className="object-cover grayscale brightness-[0.35] contrast-125"
            src="/images/products/geosynthetics_hero_1772752854099.png"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-12 text-primary text-xs font-bold tracking-[0.4em] uppercase">
            <Link className="hover:text-white transition-colors" href="/">Home</Link>
            <span className="text-[8px]">●</span>
            <span className="text-primary">Geossintéticos</span>
          </div>
          <div className="max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight text-white mb-6 uppercase font-industrial leading-[1.05] opacity-95 drop-shadow-lg">
              GEOSSIN-<br />
              <span className="text-primary">TÉTICOS</span>
            </h1>
            <div className="h-1 w-24 bg-primary mb-10"></div>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed whitespace-pre-line drop-shadow">
              Alta performance e durabilidade para contenção, drenagem e proteção ambiental com tecnologia de ponta.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <span className="inline-block py-2 px-4 bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase rounded font-display">Engenharia Civil & Ambiental</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      < main className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-10" >

        {/* Sidebar Filters */}
        < aside className="w-full lg:w-72 shrink-0 space-y-8 bg-surface-dark lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none border border-white/5 lg:border-none shadow-2xl lg:shadow-none" >
          <div>
            <h3 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center justify-between font-display">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">filter_list</span> Categorias</span>
            </h3>
            <div className="space-y-2 lg:space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setActiveCategory(isActive ? null : cat.name);
                      setCurrentPage(1); // Reset page on category change
                    }}
                    className={`flex items-center justify-between w-full px-5 py-4 lg:px-4 lg:py-3 rounded-xl lg:rounded font-medium text-sm lg:text-sm transition-all group ${isActive
                      ? "bg-primary text-background-dark font-bold shadow-[0_0_20px_rgba(255,165,0,0.15)]"
                      : "bg-white/5 hover:bg-white/10 lg:bg-transparent lg:hover:bg-white/5 text-slate-300 hover:text-primary border border-white/5 lg:border-none"
                      }`}
                  >
                    <div className="flex items-center gap-4 lg:gap-3">
                      <span className="material-symbols-outlined text-[24px] lg:text-[20px]">{cat.icon}</span> {cat.name}
                    </div>
                    <span className={`material-symbols-outlined text-[20px] lg:text-[16px] transition-opacity ${isActive ? '' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                      {isActive ? 'check' : 'chevron_right'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 lg:pt-6 border-t border-white/10">
            <h3 className="text-primary text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] mb-5 lg:mb-4 font-display">Material</h3>
            <div className="flex flex-wrap gap-3 lg:gap-2">
              <label className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-3 lg:px-3 lg:py-1.5 rounded-lg border border-white/10 lg:border-white/5 transition-all">
                <input className="form-checkbox bg-background-dark border-white/20 lg:border-white/10 rounded lg:rounded-sm w-5 h-5 lg:w-4 lg:h-4 text-primary focus:ring-primary focus:ring-offset-background-dark" type="checkbox" />
                <span className="text-sm lg:text-xs font-medium text-slate-300">PEAD</span>
              </label>
              <label className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-3 lg:px-3 lg:py-1.5 rounded-lg border border-white/10 lg:border-white/5 transition-all">
                <input className="form-checkbox bg-background-dark border-white/20 lg:border-white/10 rounded lg:rounded-sm w-5 h-5 lg:w-4 lg:h-4 text-primary focus:ring-primary focus:ring-offset-background-dark" type="checkbox" />
                <span className="text-sm lg:text-xs font-medium text-slate-300">PVC</span>
              </label>
              <label className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-3 lg:px-3 lg:py-1.5 rounded-lg border border-white/10 lg:border-white/5 transition-all">
                <input className="form-checkbox bg-background-dark border-white/20 lg:border-white/10 rounded lg:rounded-sm w-5 h-5 lg:w-4 lg:h-4 text-primary focus:ring-primary focus:ring-offset-background-dark" type="checkbox" />
                <span className="text-sm lg:text-xs font-medium text-slate-300">Poliéster</span>
              </label>
            </div>
          </div>

          <div className="pt-8 lg:pt-6 border-t border-white/10">
            <h3 className="text-primary text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] mb-5 lg:mb-4 font-display">Espessura (mm)</h3>
            <div className="space-y-4 lg:space-y-3">
              <input className="w-full h-2 lg:h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
              <div className="flex justify-between text-xs lg:text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                <span>0.5 mm</span>
                <span>3.0 mm</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveCategory(null);
              setCurrentPage(1);
            }}
            className="w-full py-4 lg:py-3 mt-4 lg:mt-0 bg-transparent border border-primary/20 hover:border-primary/50 hover:bg-primary/5 rounded-xl lg:rounded text-primary text-xs font-black uppercase tracking-widest transition-all font-display"
          >
            Limpar Filtros
          </button>
        </aside >

        {/* Product Grid Container */}
        < div className="flex-1" >

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-8 pb-4 border-b border-slate-800">
                  <p className="text-slate-500 text-sm font-medium">
                    Mostrando <span className="text-slate-100">{totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> de <span className="text-slate-100">{totalItems}</span> produtos
                  </p>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 font-display">Ordenar:</span>
                    <select className="bg-transparent border-none text-slate-100 text-sm font-bold focus:ring-0 cursor-pointer outline-none">
                      <option className="bg-background-dark">Mais Relevantes</option>
                      <option className="bg-background-dark">Nome A-Z</option>
                      <option className="bg-background-dark">Popularidade</option>
                    </select>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                      <span className="text-xs font-bold uppercase tracking-widest">Carregando catálogo...</span>
                    </div>
                  ) : (
                    paginatedProducts.map((product) => (
                      <Link href={`/produtos/${product.slug}`} key={product.id} className="group bg-[#0d2035] border border-white/5 hover:border-primary/50 transition-all overflow-hidden flex flex-col hover:-translate-y-1 duration-300">
                        <div className="relative h-56 overflow-hidden bg-slate-900 flex items-center justify-center">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-2 py-1 bg-[#07121d]/80 backdrop-blur text-[10px] font-black text-primary uppercase border border-primary/20 font-display">Geossintéticos</span>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-primary transition-colors font-display">{product.name}</h3>
                          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                          <div className="mt-auto space-y-4">
                            <div className="flex flex-wrap items-center gap-4 py-3 border-t border-slate-800/50">
                              {product.technical_sheet && typeof product.technical_sheet === 'object' && Object.entries(product.technical_sheet).slice(0, 2).map(([key, value], index) => (
                                <div key={index} className="flex flex-col">
                                  <span className="text-[10px] uppercase font-black text-slate-600 tracking-tighter font-display">{key}</span>
                                  <span className="text-xs font-bold text-slate-300">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 group-hover:bg-primary text-slate-300 group-hover:text-background-dark text-xs font-black uppercase tracking-widest transition-all font-display">
                              Ver Detalhes <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                  {!loading && paginatedProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500">
                      Nenhum produto encontrado nesta categoria.
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="size-10 flex items-center justify-center border border-white/10 text-white/60 hover:text-primary hover:border-primary/30 disabled:opacity-30 disabled:hover:text-white/60 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all font-bold text-sm"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {getVisiblePages().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
                        disabled={page === "..."}
                        className={`size-10 flex items-center justify-center font-bold text-sm transition-all ${page === currentPage
                          ? "bg-[#D6A76E] text-[#0A1628]"
                          : page === "..."
                            ? "text-slate-600 bg-transparent border-none cursor-default"
                            : "border border-white/10 text-white/60 hover:text-primary hover:border-primary/30"
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="size-10 flex items-center justify-center border border-white/10 text-white/60 hover:text-primary hover:border-primary/30 disabled:opacity-30 disabled:hover:text-white/60 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all font-bold text-sm"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </main >
    </div >
  )
}
