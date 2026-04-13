"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiptapEditor } from "@/components/cms/tiptap-editor";
import { logAction } from "@/utils/logger";

export function EditPageClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [pageData, setPageData] = useState<any>(null);
    const [content, setContent] = useState<any>({});

    useEffect(() => {
        const fetchPage = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("pages")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) {
                console.error("Erro ao buscar página:", error);
            } else if (data) {
                setPageData(data);
                setContent(data.content || {});
            }
            setFetching(false);
        };
        fetchPage();
    }, [slug]);

    const handleContentChange = (key: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase
            .from("pages")
            .update({ content })
            .eq("slug", slug);

        if (error) {
            alert("Erro ao salvar: " + error.message);
        } else {
            // Log Action
            await logAction({
                action: 'UPDATE',
                entityType: 'page',
                entityName: pageData.name,
                details: { slug }
            });

            // Volta para a listagem
            router.push("/dashboard/paginas");
            router.refresh();
        }
        setLoading(false);
    };

    if (fetching) return (
        <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-[#cba36d]/20 border-t-[#cba36d] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Carregando dados da página...</p>
        </div>
    );

    if (!pageData) return (
        <div className="p-20 text-center">
            <p className="text-red-500 font-bold">Página não encontrada no banco de dados.</p>
        </div>
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, cardIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `pages/${fileName}`;

        const { error } = await supabase.storage.from('product-images').upload(filePath, file);

        if (!error) {
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
            const newCards = [...(content.cards || [])];
            newCards[cardIndex] = { ...newCards[cardIndex], image: publicUrl };
            handleContentChange("cards", newCards);
        } else {
            alert("Erro no upload da imagem: " + error.message);
        }
        setLoading(false);
    };

    const renderFields = () => {
        switch (pageData.slug) {
            case "sobre":
                return (
                    <>
                        {/* Removed hero_title as requested */}
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Texto da História (Nossa Cultura)</label>
                            <TiptapEditor
                                value={content.history_text || ""}
                                onChange={val => handleContentChange("history_text", val)}
                            />
                        </div>

                        {/* FAQ Editor */}
                        <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#cba36d]">FAQ (Perguntas Frequentes)</label>
                                <button type="button" onClick={() => {
                                    const faq = content.faq || [];
                                    if (faq.length < 5) handleContentChange("faq", [...faq, { question: "", answer: "" }]);
                                    else alert("Limite máximo de 5 perguntas alcançado.");
                                }} className="text-xs text-white bg-primary/20 px-3 py-1 rounded hover:bg-primary/40 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">add</span> Adicionar Pergunta
                                </button>
                            </div>
                            <div className="space-y-4">
                                {(content.faq || []).map((q: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5 relative group">
                                        <div className="flex-1 space-y-3">
                                            <input type="text" placeholder="Pergunta" className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none transition-all font-medium text-sm" value={q.question} onChange={e => {
                                                const newFaq = [...(content.faq || [])];
                                                newFaq[i] = { ...newFaq[i], question: e.target.value };
                                                handleContentChange("faq", newFaq);
                                            }} />
                                            <textarea rows={2} placeholder="Resposta" className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-slate-300 focus:border-primary/50 outline-none transition-all text-sm resize-none" value={q.answer} onChange={e => {
                                                const newFaq = [...(content.faq || [])];
                                                newFaq[i] = { ...newFaq[i], answer: e.target.value };
                                                handleContentChange("faq", newFaq);
                                            }} />
                                        </div>
                                        <button type="button" onClick={() => {
                                            const newFaq = [...(content.faq || [])];
                                            newFaq.splice(i, 1);
                                            handleContentChange("faq", newFaq);
                                        }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                ))}
                                {(!content.faq || content.faq.length === 0) && (
                                    <p className="text-slate-500 text-sm text-center py-4">Nenhuma pergunta cadastrada.</p>
                                )}
                            </div>
                        </div>

                        {/* CTA Editor */}
                        <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#cba36d] mb-2 block">Call to Action (Rodapé)</label>
                            <div className="space-y-3">
                                <input type="text" placeholder="Título Principal do CTA" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={content.cta?.title || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), title: e.target.value })} />
                                <textarea rows={2} placeholder="Subtítulo/Texto de apoio" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-300 focus:border-primary/50 outline-none transition-all text-sm resize-none" value={content.cta?.text || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), text: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Texto do Botão (Ex: Agendar Consultoria)" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={content.cta?.buttonText || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), buttonText: e.target.value })} />
                                    <input type="text" placeholder="Link do Botão (Ex: /contato)" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={content.cta?.buttonLink || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), buttonLink: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "servicos":
                return (
                    <>
                        <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#cba36d] mb-4 block">Descrição Geral (Texto Introdutório)</label>
                            <TiptapEditor
                                value={content.description || ""}
                                onChange={val => handleContentChange("description", val)}
                            />
                        </div>

                        {/* Cards Editor (Pilares) */}
                        <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#cba36d]">Serviços Específicos (Pilares/Cards)</label>
                                <button type="button" onClick={() => {
                                    const cards = content.cards || [];
                                    handleContentChange("cards", [...cards, { id: Date.now().toString(), tag: `Pilar 0${cards.length + 1}`, title: "", description: "", list: [], buttonText: "", buttonLink: "", image: "" }]);
                                }} className="text-xs text-white bg-primary/20 px-3 py-1 rounded hover:bg-primary/40 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">add</span> Adicionar Card
                                </button>
                            </div>
                            <div className="space-y-6">
                                {(content.cards || []).map((card: any, i: number) => (
                                    <div key={card.id || i} className="flex gap-4 flex-col bg-black/20 p-5 rounded-xl border border-white/5 relative group">
                                        <div className="flex justify-between items-center bg-white/5 -mx-5 -mt-5 px-5 py-3 border-b border-white/5 rounded-t-xl mb-4">
                                            <span className="text-xs font-bold text-slate-300">Card #{i + 1}</span>
                                            <button type="button" onClick={() => {
                                                const newCards = [...(content.cards || [])];
                                                newCards.splice(i, 1);
                                                handleContentChange("cards", newCards);
                                            }} className="text-red-500 hover:bg-red-500/20 px-2 py-1 rounded text-xs transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">delete</span> Excluir
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Tag (Ex: Pilar 01)" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2 text-primary focus:border-primary/50 outline-none transition-all text-xs font-bold uppercase tracking-widest" value={card.tag || ""} onChange={e => {
                                                        const newCards = [...(content.cards || [])];
                                                        newCards[i] = { ...newCards[i], tag: e.target.value };
                                                        handleContentChange("cards", newCards);
                                                    }} />
                                                    <input type="text" placeholder="Título (Ex: Instalação)" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2 text-white focus:border-primary/50 outline-none transition-all text-sm font-bold" value={card.title || ""} onChange={e => {
                                                        const newCards = [...(content.cards || [])];
                                                        newCards[i] = { ...newCards[i], title: e.target.value };
                                                        handleContentChange("cards", newCards);
                                                    }} />
                                                </div>
                                                <textarea rows={3} placeholder="Descrição curta do serviço" className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-slate-300 focus:border-primary/50 outline-none transition-all text-sm resize-none" value={card.description || ""} onChange={e => {
                                                    const newCards = [...(content.cards || [])];
                                                    newCards[i] = { ...newCards[i], description: e.target.value };
                                                    handleContentChange("cards", newCards);
                                                }} />
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Itens de Check (Uma frase por linha)</label>
                                                    <textarea rows={3} placeholder="Ex:&#10;Montagem Eletromecânica&#10;Adequações NR" className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-slate-300 focus:border-primary/50 outline-none transition-all text-sm resize-none leading-relaxed" value={(card.list || []).join('\n')} onChange={e => {
                                                        const newCards = [...(content.cards || [])];
                                                        newCards[i] = { ...newCards[i], list: e.target.value.split('\n').filter(Boolean) };
                                                        handleContentChange("cards", newCards);
                                                    }} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="text" placeholder="Texto Botão (Ex: Solicitar Orçamento)" className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={card.buttonText || ""} onChange={e => {
                                                        const newCards = [...(content.cards || [])];
                                                        newCards[i] = { ...newCards[i], buttonText: e.target.value };
                                                        handleContentChange("cards", newCards);
                                                    }} />
                                                    <input type="text" placeholder="Link (Ex: /contato)" className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={card.buttonLink || ""} onChange={e => {
                                                        const newCards = [...(content.cards || [])];
                                                        newCards[i] = { ...newCards[i], buttonLink: e.target.value };
                                                        handleContentChange("cards", newCards);
                                                    }} />
                                                </div>
                                                <div className="space-y-2 border border-white/10 p-4 rounded-lg bg-black/20">
                                                    <label className="text-[10px] uppercase text-slate-500 font-bold flex justify-between">
                                                        <span>Imagem (Upload)</span>
                                                        {card.image && <span className="text-white">✅ Envida</span>}
                                                    </label>

                                                    {card.image ? (
                                                        <div className="relative aspect-video rounded overflow-hidden mt-2 group/img border border-white/10">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={card.image} alt="Card Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                <button type="button" onClick={() => {
                                                                    const newCards = [...(content.cards || [])];
                                                                    newCards[i] = { ...newCards[i], image: "" };
                                                                    handleContentChange("cards", newCards);
                                                                }} className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs font-bold shadow-lg">Remover</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 text-center rounded-xl border border-dashed border-white/20 p-6 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                onChange={(e) => handleImageUpload(e, i)}
                                                            />
                                                            <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">image</span>
                                                            <p className="text-xs font-medium text-slate-400">Clique para enviar a foto</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!content.cards || content.cards.length === 0) && (
                                    <p className="text-slate-500 text-sm text-center py-4">Nenhum serviço/card adicionado.</p>
                                )}
                            </div>
                        </div>

                        {/* CTA Editor */}
                        <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#cba36d] mb-2 block">Call to Action (Rodapé)</label>
                            <div className="space-y-3">
                                <input type="text" placeholder="Título Principal do CTA" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={content.cta?.title || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), title: e.target.value })} />
                                <textarea rows={2} placeholder="Subtítulo/Texto de apoio" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-300 focus:border-primary/50 outline-none transition-all text-sm resize-none" value={content.cta?.text || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), text: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Texto do Botão (Ex: Agendar Consultoria)" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={content.cta?.buttonText || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), buttonText: e.target.value })} />
                                    <input type="text" placeholder="Link do Botão (Ex: /contato)" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all text-sm font-medium" value={content.cta?.buttonLink || ""} onChange={e => handleContentChange("cta", { ...(content.cta || {}), buttonLink: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "construcao-civil":
            case "geossinteticos":
                return (
                    <>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Título do Topo</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                                    value={content.hero_title || ""}
                                    onChange={e => handleContentChange("hero_title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Subtítulo do Topo</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-[#cba36d] focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-medium text-sm"
                                    value={content.hero_subtitle || ""}
                                    onChange={e => handleContentChange("hero_subtitle", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Descrição Comercial Detalhada</label>
                            <TiptapEditor
                                value={content.description || ""}
                                onChange={val => handleContentChange("description", val)}
                            />
                        </div>
                    </>
                );
            case "contato":
                return (
                    <>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Endereço Físico</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all font-medium"
                                value={content.address || ""}
                                onChange={e => handleContentChange("address", e.target.value)}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Telefone Principal (WhatsApp)</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all font-medium"
                                    value={content.phone || ""}
                                    onChange={e => handleContentChange("phone", e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">E-mail Comercial</label>
                                <input
                                    type="email"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all font-medium"
                                    value={content.email || ""}
                                    onChange={e => handleContentChange("email", e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                );
            default:
                // Editor genérico caso uma página não mapeada surja via DB
                return (
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Dados Brutos (JSON)</label>
                        <textarea
                            rows={15}
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all font-mono text-sm"
                            value={JSON.stringify(content, null, 2)}
                            onChange={e => {
                                try {
                                    setContent(JSON.parse(e.target.value))
                                } catch (err) {
                                    // Ignora erro de parse enquanto digita
                                }
                            }}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-2 block">
                        EDITOR DE PÁGINA FIXA
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-4">
                        Editando: {pageData.name}
                    </h1>
                    <div className="h-1 w-16 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
                </div>

                <Link
                    href="/dashboard/paginas"
                    className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-[#cba36d] hover:bg-[#cba36d]/10 hover:border-[#cba36d]/30 transition-all flex items-center gap-3 shrink-0 group"
                >
                    <span className="material-symbols-outlined font-bold text-lg group-hover:-translate-x-1 transition-transform border-none">arrow_back</span>
                    Voltar para Lista
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-4xl pb-32">
                <section className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-2xl space-y-10 group hover:border-[#cba36d]/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                            <span className="material-symbols-outlined">edit_square</span>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Conteúdo (JSONB)</h3>
                    </div>

                    <div className="space-y-8">
                        {renderFields()}
                    </div>
                </section>

                <div className="mt-12 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-[#cba36d] to-[#e0b885] hover:to-[#f0c895] text-[#0d1b2a] font-black text-xs uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(203,163,109,0.2)] disabled:opacity-50 disabled:hover:translate-y-0 shadow-lg"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-[#0d1b2a]/20 border-t-[#0d1b2a] rounded-full animate-spin"></div>
                        ) : (
                            <span className="material-symbols-outlined text-lg">save</span>
                        )}
                        Salvar e Publicar
                    </button>
                </div>
            </form>
        </div>
    );
}
