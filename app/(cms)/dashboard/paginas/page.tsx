"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface PageModel {
    id: string;
    slug: string;
    name: string;
    updated_at: string;
}

export default function PagesListPage() {
    const [pages, setPages] = useState<PageModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from("pages")
                .select("id, slug, name, updated_at")
                .order("name", { ascending: true });

            if (error) {
                console.error("Erro ao carregar páginas:", error);
            } else {
                setPages(data || []);
            }
            setLoading(false);
        };
        fetchPages();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full max-h-full flex flex-col relative">
            <div className="sticky top-0 z-20 bg-[#050b14]/95 backdrop-blur-md pb-4 pt-4 md:pt-0 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                    <div>
                        <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-2 block">
                            GESTOR DE CONTEÚDO
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-4">
                            Páginas do Site
                        </h1>
                        <div className="h-1 w-16 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
                    </div>

                    {/* 
                    O botão Novo não está aqui de propósito, pois foi definido no Socratic 
                    que manteríamos apenas o escopo de edição das 5 páginas predeterminadas. 
                    */}
                </div>
            </div>

            <div className="bg-[#0d1b2a] lg:rounded-[32px] border-y lg:border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 lg:p-0 flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="hidden lg:grid grid-cols-[3fr_2fr_5fr_auto] gap-6 px-10 py-6 bg-white/5 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-white/5 shrink-0 z-10 rounded-t-[32px]">
                    <div>Nome da Página</div>
                    <div>Slug (URL)</div>
                    <div>Última Atualização</div>
                    <div className="text-right">Ação</div>
                </div>

                <div className="flex flex-col divide-y divide-white/5 flex-1 overflow-y-auto custom-scrollbar lg:rounded-b-[32px]">
                    {loading ? (
                        <div className="p-10 py-32 text-center">
                            <div className="w-10 h-10 border-4 border-[#cba36d]/20 border-t-[#cba36d] rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Carregando páginas...</p>
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="p-10 py-32 text-center">
                            <div className="material-symbols-outlined text-[#cba36d]/20 text-6xl mb-4">web_stories</div>
                            <p className="text-slate-500 font-medium italic">Nenhuma página encontrada no sistema.</p>
                        </div>
                    ) : (
                        pages.map((page) => (
                            <div key={page.id} className="flex flex-col lg:grid lg:grid-cols-[3fr_2fr_5fr_auto] lg:items-center gap-4 lg:gap-6 p-4 lg:px-10 lg:py-6 bg-[#050b14]/50 lg:bg-transparent rounded-2xl lg:rounded-none mb-3 lg:mb-0 border border-white/5 lg:border-none hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#cba36d]/30 text-[#cba36d]/60 group-hover:text-[#cba36d] transition-colors">
                                        <span className="material-symbols-outlined">text_snippet</span>
                                    </div>
                                    <p className="text-base font-bold text-white group-hover:text-[#cba36d] transition-colors truncate">
                                        {page.name}
                                    </p>
                                </div>

                                <div className="flex flex-col lg:block gap-2 min-w-0">
                                    <span className="lg:hidden text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">Slug (URL)</span>
                                    <span className="text-[10px] font-mono text-slate-400 p-2 bg-slate-950 rounded-lg inline-block border border-white/5 group-hover:border-[#cba36d]/20 transition-colors">
                                        /{page.slug}
                                    </span>
                                </div>

                                <div className="flex flex-col lg:block gap-2">
                                    <span className="lg:hidden text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">Última Atualização</span>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider py-1 lg:py-0">
                                        {new Date(page.updated_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                <div className="flex items-center justify-start lg:justify-end gap-2 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-white/5 lg:border-none w-full lg:w-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0">
                                    <Link
                                        href={`/dashboard/paginas/editar/${page.slug}`}
                                        className="w-full lg:w-auto h-10 px-6 flex items-center justify-center bg-[#cba36d]/10 border border-[#cba36d]/20 text-[#cba36d] hover:bg-[#cba36d] hover:text-[#0d1b2a] rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest gap-2"
                                        title="Editar Conteúdo"
                                    >
                                        <span className="material-symbols-outlined text-base">edit_note</span>
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
