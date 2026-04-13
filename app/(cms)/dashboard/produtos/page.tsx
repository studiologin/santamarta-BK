"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { logAction } from "@/utils/logger";

export default function ProductsListPage() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("categoria");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        let query = supabase
            .from("products")
            .select("*")
            .order("is_active", { ascending: false })
            .order("created_at", { ascending: false });

        if (currentCategory) {
            query = query.eq("category", currentCategory);
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    }, [currentCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleToggleActive = async (id: string, currentStatus: boolean, name: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("products")
            .update({ is_active: !currentStatus })
            .eq("id", id);

        if (error) {
            alert("Erro ao atualizar status");
        } else {
            setProducts(prev =>
                prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p)
            );

            await logAction({
                action: !currentStatus ? 'PUBLISH' : 'HIDE',
                entityType: 'product',
                entityName: name,
                details: { 'was_active': currentStatus }
            });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            const supabase = createClient();
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) {
                alert("Erro ao excluir produto");
            } else {
                fetchProducts();

                await logAction({
                    action: 'DELETE',
                    entityType: 'product',
                    entityName: name
                });
            }
        }
    };

    const filteredProducts = (products || []).filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (a.is_active === b.is_active) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_active ? -1 : 1;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full max-h-full flex flex-col relative">
            {/* Cabeçalho da Seção */}
            <div className="sticky top-0 z-20 bg-[#050b14]/95 backdrop-blur-md pb-4 pt-4 md:pt-0 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                    <div>
                        <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-2 block">
                            {currentCategory ? (currentCategory === 'geossinteticos' ? 'Geossintéticos' : 'Construção Civil') : 'GERENCIAMENTO'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-4">
                            {currentCategory ? (currentCategory === 'geossinteticos' ? 'Geossintéticos' : 'Construção Civil') : 'Produtos'}
                        </h1>
                        <div className="h-1 w-16 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                        {/* Barra de Pesquisa */}
                        <div className="relative group min-w-[300px]">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#cba36d] transition-colors text-xl">search</span>
                            <input 
                                type="text"
                                placeholder="Pesquisar produto..."
                                className="w-full bg-[#0d1b2a] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#cba36d]/50 transition-all font-medium text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            )}
                        </div>

                        <Link
                            href={`/dashboard/produtos/novo?categoria=${currentCategory || 'geossinteticos'}`}
                            className="bg-[#cba36d] text-[#0d1b2a] px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#b8925c] transition-all shadow-xl shadow-[#cba36d]/10 flex items-center justify-center gap-3 active:scale-95 shrink-0"
                        >
                            <span className="material-symbols-outlined font-bold text-lg">add</span>
                            Novo Produto
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-[#0d1b2a] lg:rounded-[32px] border-y lg:border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 lg:p-0 flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Cabeçalho Desktop Fixo */}
                <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_auto] gap-6 px-10 py-6 bg-white/5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-white/5 shrink-0 z-10">
                    <div>Informações do Produto</div>
                    <div>Categoria</div>
                    <div>Status</div>
                    <div>Última Modificação</div>
                    <div className="text-right">Ações</div>
                </div>

                <div className="flex flex-col divide-y divide-white/5 flex-1 overflow-y-auto custom-scrollbar lg:rounded-b-[32px]">
                    {loading ? (
                        <div className="p-10 py-32 text-center">
                            <div className="w-10 h-10 border-4 border-[#cba36d]/20 border-t-[#cba36d] rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Carregando catálogo...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-10 py-32 text-center">
                            <div className="material-symbols-outlined text-[#cba36d]/20 text-6xl mb-4">search_off</div>
                            <p className="text-slate-500 font-medium italic">Nenhum produto encontrado na pesquisa.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="flex flex-col lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1.5fr_auto] lg:items-center gap-4 lg:gap-4 p-4 lg:px-10 lg:py-3 bg-[#050b14]/50 lg:bg-transparent rounded-2xl lg:rounded-none mb-3 lg:mb-0 border border-white/5 lg:border-none hover:bg-white/[0.02] transition-colors group">
                                {/* Informações do Produto */}
                                <div className="flex items-center gap-4 lg:gap-5 min-w-0">
                                    <div className="relative w-14 h-14 lg:w-12 lg:h-12 rounded-xl bg-slate-900 overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-[#cba36d]/30 transition-colors shadow-lg">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <span className="material-symbols-outlined text-3xl lg:text-2xl">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-lg lg:text-base font-bold text-white group-hover:text-[#cba36d] transition-colors mb-1 lg:mb-0.5 truncate">{product.name}</p>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{product.slug}</p>
                                    </div>
                                </div>

                                {/* Metadados */}
                                <div className="grid grid-cols-2 lg:contents gap-4">
                                    {/* Categoria */}
                                    <div className="flex flex-col lg:block gap-2 min-w-0">
                                        <span className="lg:hidden text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">Categoria</span>
                                        <div className="inline-flex">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:px-4 lg:py-2 bg-white/5 rounded-xl text-slate-400 group-hover:bg-[#cba36d]/10 group-hover:text-[#cba36d] transition-all border border-white/5 group-hover:border-[#cba36d]/20 whitespace-nowrap">
                                                {product.category === 'geossinteticos' ? 'Geossintéticos' : 'Civil'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex flex-col lg:block gap-2">
                                        <span className="lg:hidden text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">Status</span>
                                        <div className="flex items-center gap-2 lg:gap-3 py-1 lg:py-0">
                                            <div className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${product.is_active ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`}></div>
                                            <span className={`text-[10px] lg:text-[11px] font-bold uppercase tracking-widest ${product.is_active ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                                {product.is_active ? 'Publicado' : 'Oculto'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Data */}
                                    <div className="flex flex-col lg:block gap-2 col-span-2 lg:col-span-1">
                                        <span className="lg:hidden text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">Última Modificação</span>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider py-1 lg:py-0">
                                            {new Date(product.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="flex items-center justify-start lg:justify-end gap-2 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-white/5 lg:border-none w-full lg:w-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0">
                                    <button
                                        onClick={() => handleToggleActive(product.id, product.is_active, product.name)}
                                        className={cn(
                                            "flex-1 lg:flex-none h-10 lg:w-8 lg:h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg transition-all",
                                            product.is_active ? "text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/50" : "text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50"
                                        )}
                                        title={product.is_active ? "Ocultar" : "Mostrar"}
                                    >
                                        <span className="material-symbols-outlined text-[18px] lg:text-base">{product.is_active ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                    <Link
                                        href={`/dashboard/produtos/editar/${product.id}`}
                                        className="flex-1 lg:flex-none h-10 lg:w-8 lg:h-8 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-[#cba36d] hover:border-[#cba36d]/50 hover:bg-[#cba36d]/10 rounded-lg transition-all"
                                        title="Editar"
                                    >
                                        <span className="material-symbols-outlined text-[18px] lg:text-base">edit_note</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="flex-1 lg:flex-none h-10 lg:w-8 lg:h-8 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Excluir"
                                    >
                                        <span className="material-symbols-outlined text-[18px] lg:text-base">delete_sweep</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
