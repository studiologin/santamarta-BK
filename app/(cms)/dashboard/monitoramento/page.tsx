"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function MonitoramentoPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        google_analytics_id: "",
        facebook_pixel_id: "",
        google_tag_manager_id: "",
        header_scripts: "",
        body_scripts: ""
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "monitoring")
                .maybeSingle();

            if (data) {
                setSettings(data.value);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        const supabase = createClient();

        // Verifica se já existe, se não, insere. Mas o insert inicial deve ter resolvido.
        const { error } = await supabase
            .from("site_settings")
            .upsert({
                key: "monitoring",
                value: settings,
                updated_at: new Date()
            }, { onConflict: 'key' });

        if (error) {
            console.error(error);
            alert("Erro ao salvar configurações");
        } else {
            alert("Configurações salvas com sucesso!");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-[#cba36d]/20 border-t-[#cba36d] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 shrink-0">
                <div>
                    <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-2 block">
                        ANÁLISE E MÉTRICAS
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-4">
                        Monitoramento
                    </h1>
                    <div className="h-1 w-16 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#cba36d] text-[#0d1b2a] px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#b8925c] transition-all shadow-xl shadow-[#cba36d]/10 flex items-center gap-3 active:scale-95 disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-[#0d1b2a]/20 border-t-[#0d1b2a] rounded-full animate-spin"></div>
                    ) : (
                        <span className="material-symbols-outlined font-bold text-lg">save</span>
                    )}
                    Salvar Alterações
                </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                {/* Canais Principais */}
                <section className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-2xl space-y-8 group hover:border-[#cba36d]/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">IDs de Rastreamento</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Google Analytics ID (G-XXXXX)</label>
                            <input
                                type="text"
                                placeholder="G-XXXXXXXXXX"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                                value={settings.google_analytics_id}
                                onChange={e => setSettings({ ...settings, google_analytics_id: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Facebook Pixel ID</label>
                            <input
                                type="text"
                                placeholder="1234567890"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                                value={settings.facebook_pixel_id}
                                onChange={e => setSettings({ ...settings, facebook_pixel_id: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Google Tag Manager ID (GTM-XXXXX)</label>
                            <input
                                type="text"
                                placeholder="GTM-XXXXXX"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                                value={settings.google_tag_manager_id}
                                onChange={e => setSettings({ ...settings, google_tag_manager_id: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                {/* Scripts Customizados */}
                <section className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-2xl space-y-8 group hover:border-emerald-500/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <span className="material-symbols-outlined">code</span>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Scripts Personalizados</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 decoration-emerald-500/30 underline-offset-4 underline">Header Scripts (Inseridos no &lt;head&gt;)</label>
                            <textarea
                                rows={6}
                                placeholder="<!-- Insira scripts que devem rodar no Header -->"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 font-mono text-xs leading-relaxed custom-scrollbar"
                                value={settings.header_scripts}
                                onChange={e => setSettings({ ...settings, header_scripts: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 decoration-amber-500/30 underline-offset-4 underline">Body Scripts (Inseridos no &lt;body&gt;)</label>
                            <textarea
                                rows={6}
                                placeholder="<!-- Insira scripts que devem rodar no final do Body -->"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-700 font-mono text-xs leading-relaxed custom-scrollbar"
                                value={settings.body_scripts}
                                onChange={e => setSettings({ ...settings, body_scripts: e.target.value })}
                            />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
