"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        products: 0,
        geossinteticos: 0,
        construcaoCivil: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        router.push("/dashboard/produtos?categoria=construcao-civil");
        const fetchStats = async () => {
            const supabase = createClient();
            const { data: products } = await supabase.from("products").select("category");

            if (products) {
                setStats({
                    products: products.length,
                    geossinteticos: products.filter(p => p.category === 'geossinteticos').length,
                    construcaoCivil: products.filter(p => p.category === 'construcao-civil').length,
                });
            }
            setLoading(false);
        };
        fetchStats();
    }, [router]);

    return (
        <div className="p-10 lg:p-16 animate-in fade-in slide-in-from-bottom-4 duration-700 relative h-full overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 z-20 bg-[#050b14]/95 backdrop-blur-md pb-4 pt-4 md:pt-0 mb-12 -mx-10 px-10 lg:-mx-16 lg:px-16">
                <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-4 block">PLATAFORMA DE CONTROLE</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    Visão Geral
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Total de Produtos */}
                <div className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:border-[#cba36d]/30">
                    <div className="absolute top-0 right-0 p-8 material-symbols-outlined text-[#cba36d]/5 text-8xl rotate-12 group-hover:scale-125 group-hover:text-[#cba36d]/10 transition-all duration-700 pointer-events-none">inventory_2</div>
                    <div className="relative z-10">
                        <p className="text-[#cba36d]/60 text-[11px] uppercase tracking-[0.2em] font-black mb-6">CATÁLOGO COMPLETO</p>
                        <div className="flex items-baseline gap-4">
                            <p className="text-6xl font-black text-white tracking-tighter">
                                {loading ? "..." : stats.products}
                            </p>
                            <span className="text-xs font-bold text-slate-500 uppercase">Itens</span>
                        </div>
                        <p className="mt-6 text-sm text-slate-400 font-medium">Produtos registrados no sistema</p>
                    </div>
                </div>

                {/* Geossintéticos */}
                <div className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:border-[#cba36d]/30">
                    <div className="absolute top-0 right-0 p-8 material-symbols-outlined text-[#cba36d]/5 text-8xl rotate-12 group-hover:scale-125 group-hover:text-[#cba36d]/10 transition-all duration-700 pointer-events-none">grid_view</div>
                    <div className="relative z-10">
                        <p className="text-[#cba36d]/60 text-[11px] uppercase tracking-[0.2em] font-black mb-6">GEOSSINTÉTICOS</p>
                        <div className="flex items-baseline gap-4">
                            <p className="text-6xl font-black text-white tracking-tighter">
                                {loading ? "..." : stats.geossinteticos}
                            </p>
                            <span className="text-xs font-bold text-slate-500 uppercase">Itens</span>
                        </div>
                        <p className="mt-6 text-sm text-slate-400 font-medium">Soluções ambientais e de engenharia</p>
                    </div>
                </div >

                {/* Construção Civil */}
                < div className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:border-[#cba36d]/30" >
                    <div className="absolute top-0 right-0 p-8 material-symbols-outlined text-[#cba36d]/5 text-8xl rotate-12 group-hover:scale-125 group-hover:text-[#cba36d]/10 transition-all duration-700 pointer-events-none">apartment</div>
                    <div className="relative z-10">
                        <p className="text-[#cba36d]/60 text-[11px] uppercase tracking-[0.2em] font-black mb-6">CONSTRUÇÃO CIVIL</p>
                        <div className="flex items-baseline gap-4">
                            <p className="text-6xl font-black text-white tracking-tighter">
                                {loading ? "..." : stats.construcaoCivil}
                            </p>
                            <span className="text-xs font-bold text-slate-500 uppercase">Itens</span>
                        </div>
                        <p className="mt-6 text-sm text-slate-400 font-medium">Infraestrutura e edificações</p>
                    </div>
                </div >
            </div >

            {/* Quick Actions / Recent Activity Placeholder */}
            < div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8" >
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex items-center justify-between group hover:bg-white/[0.04] transition-all cursor-pointer">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">Novo Produto</h3>
                        <p className="text-slate-500 text-sm">Adicione um novo item ao catálogo</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#cba36d] text-[#0d1b2a] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined font-bold">add</span>
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex items-center justify-between group hover:bg-white/[0.04] transition-all cursor-pointer">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">Gerenciar Categorias</h3>
                        <p className="text-slate-500 text-sm">Organize a estrutura do site</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                        <span className="material-symbols-outlined font-bold">settings</span>
                    </div>
                </div>
            </div >
        </div >
    );
}
