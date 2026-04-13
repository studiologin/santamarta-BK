"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { logAction } from "@/utils/logger";
import {
    Save,
    Plus,
    Trash2,
    Upload,
    X,
    Check,
    ChevronDown,
    ChevronUp,
    FileText,
    Image as ImageIcon
} from "lucide-react";

interface ProductFormProps {
    productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("categoria");
    const isEditing = !!productId;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [allProducts, setAllProducts] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        category: categoryParam || "geossinteticos",
        image_url: "",
        gallery_urls: [] as string[],
        usage_application: "",
        is_active: true,
    });

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
            .trim()
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/-+/g, "-"); // Replace multiple - with single -
    };

    const [technicalSheet, setTechnicalSheet] = useState<{ key: string, value: string }[]>([
        { key: "", value: "" }
    ]);

    const [similarIds, setSimilarIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("products").select("id, name");
            setAllProducts(data || []);
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (isEditing && productId) {
            const fetchProduct = async () => {
                const supabase = createClient();
                const { data: product, error } = await supabase
                    .from("products")
                    .select("*, similar_products!product_id(similar_id)")
                    .eq("id", productId)
                    .single();

                if (error) {
                    console.error("Error fetching product:", error);
                    setFetching(false);
                    return;
                }

                if (product) {
                    setFormData({
                        name: product.name,
                        slug: product.slug,
                        description: product.description || "",
                        category: product.category,
                        image_url: product.image_url || "",
                        gallery_urls: product.gallery_urls || [],
                        usage_application: product.usage_application || "",
                        is_active: product.is_active,
                    });

                    if (product.technical_sheet && typeof product.technical_sheet === 'object') {
                        const sheet = Object.entries(product.technical_sheet).map(([key, value]) => ({
                            key, value: String(value)
                        }));
                        setTechnicalSheet(sheet.length > 0 ? sheet : [{ key: "", value: "" }]);
                    }

                    const simIds = (product.similar_products as any[])?.map(s => s.similar_id) || [];
                    setSimilarIds(simIds);
                }
                setFetching(false);
            };
            fetchProduct();
        }
    }, [productId, isEditing]);


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        const uploadedUrls: string[] = [];
        const supabase = createClient();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (error) {
                console.error('Error uploading:', error);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                uploadedUrls.push(publicUrl);
            }
        }

        if (type === 'main') {
            setFormData(prev => ({ ...prev, image_url: uploadedUrls[0] }));
        } else {
            setFormData(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...uploadedUrls] }));
        }
        setLoading(false);
    };

    const addSheetRow = () => setTechnicalSheet([...technicalSheet, { key: "", value: "" }]);
    const removeSheetRow = (index: number) => setTechnicalSheet(technicalSheet.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();

        const sheetObject = technicalSheet.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {} as any);

        const payload = {
            ...formData,
            technical_sheet: sheetObject,
        };

        let currentId = productId;

        if (isEditing) {
            const { error } = await supabase.from("products").update(payload).eq("id", productId);
            if (error) alert(error.message);
            else {
                await logAction({
                    action: 'UPDATE',
                    entityType: 'product',
                    entityName: formData.name,
                    details: { category: formData.category }
                });
            }
        } else {
            const { data, error } = await supabase.from("products").insert(payload).select().single();
            if (error) alert(error.message);
            else {
                currentId = data.id;
                await logAction({
                    action: 'CREATE',
                    entityType: 'product',
                    entityName: formData.name,
                    details: { category: formData.category }
                });
            }
        }

        if (currentId) {
            await supabase.from("similar_products").delete().eq("product_id", currentId);
            if (similarIds.length > 0) {
                const simPayload = similarIds.map(sid => ({ product_id: currentId, similar_id: sid }));
                await supabase.from("similar_products").insert(simPayload);
            }
        }

        router.push(`/dashboard/produtos?categoria=${formData.category}`);
        router.refresh(); // Force refresh to show new data
        setLoading(false);
    };

    if (fetching) return (
        <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-[#cba36d]/20 border-t-[#cba36d] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Carregando dados do produto...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-2 block">
                        EDITOR DE CONTEÚDO
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-4">
                        {isEditing ? "Editar Produto" : "Novo Produto"}
                    </h1>
                    <div className="h-1 w-16 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
                </div>

                <Link
                    href={`/dashboard/produtos?categoria=${formData.category}`}
                    className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-[#cba36d] hover:bg-[#cba36d]/10 hover:border-[#cba36d]/30 transition-all flex items-center gap-3 shrink-0 group"
                >
                    <span className="material-symbols-outlined font-bold text-lg group-hover:-translate-x-1 transition-transform border-none">arrow_back</span>
                    Voltar para Lista
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-32">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Informações Gerais */}
                    <section className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-2xl space-y-10 group hover:border-[#cba36d]/20 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                                <span className="material-symbols-outlined">edit_note</span>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Informações Gerais</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Nome do Produto</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Geomembrana de PEAD"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                                    value={formData.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name,
                                            slug: generateSlug(name)
                                        });
                                    }}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="geomembrana-pead"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-[#cba36d] focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 font-mono text-sm"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Descrição do Produto</label>
                            <textarea
                                rows={5}
                                required
                                placeholder="Conte mais sobre as características principais deste produto..."
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 leading-relaxed font-medium"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Uso e Aplicação</label>
                            <textarea
                                rows={5}
                                placeholder="Onde este produto deve ser aplicado? Quais os cenários ideais?"
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 leading-relaxed font-medium"
                                value={formData.usage_application}
                                onChange={e => setFormData({ ...formData, usage_application: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Ficha Técnica */}
                    <section className="bg-[#0d1b2a] p-10 rounded-[32px] border border-white/5 shadow-2xl space-y-10 group hover:border-[#cba36d]/20 transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Ficha Técnica</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addSheetRow}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#cba36d]/10 text-[#cba36d] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#cba36d]/20 transition-all border border-[#cba36d]/20"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Adicionar Linha
                            </button>
                        </div>

                        <div className="space-y-4">
                            {technicalSheet.map((row, i) => (
                                <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Ex: Espessura"
                                            className="bg-slate-950/30 border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#cba36d]/30 transition-all"
                                            value={row.key}
                                            onChange={e => {
                                                const newSheet = [...technicalSheet];
                                                newSheet[i].key = e.target.value;
                                                setTechnicalSheet(newSheet);
                                            }}
                                        />
                                        <input
                                            placeholder="Ex: 0.5mm"
                                            className="bg-slate-950/30 border border-white/5 rounded-xl px-5 py-3.5 text-[#cba36d] text-sm outline-none focus:border-[#cba36d]/30 transition-all font-bold"
                                            value={row.value}
                                            onChange={e => {
                                                const newSheet = [...technicalSheet];
                                                newSheet[i].value = e.target.value;
                                                setTechnicalSheet(newSheet);
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSheetRow(i)}
                                        className="w-10 h-10 flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Coluna Lateral */}
                <div className="space-y-12">
                    {/* Configurações de Publicação */}
                    <section className="bg-[#0d1b2a] p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                                <span className="material-symbols-outlined">settings</span>
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Configurações</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Categoria Principal</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#cba36d]/50 outline-none appearance-none cursor-pointer font-bold text-sm"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="geossinteticos">Geossintéticos</option>
                                        <option value="construcao-civil">Construção Civil</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">expand_more</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Status Ativo</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                                        formData.is_active ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-transform duration-300",
                                        formData.is_active ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#cba36d] text-[#0d1b2a] py-4 px-8 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#b8925c] transition-all shadow-xl shadow-[#cba36d]/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-[#0d1b2a]/20 border-t-[#0d1b2a] rounded-full animate-spin"></div>
                            ) : (
                                <span className="material-symbols-outlined font-bold text-lg">check_circle</span>
                            )}
                            {isEditing ? "Salvar Alterações" : "Publicar Produto"}
                        </button>
                    </section>

                    {/* Mídia */}
                    <section className="bg-[#0d1b2a] p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                                <span className="material-symbols-outlined">collections</span>
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Mídia</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Hero Image (Capa)</label>
                                <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center group cursor-pointer shadow-inner">
                                    {formData.image_url ? (
                                        <Image src={formData.image_url} alt="Capa" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-[#cba36d]/20 text-5xl mb-2">add_photo_alternate</span>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Enviar Capa</p>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-[#0d1b2a]/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-[#cba36d] mb-2">cloud_upload</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cba36d]">Substituir Foto</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'main')} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Galeria de Fotos</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {formData.gallery_urls.map((url, i) => (
                                        <div key={i} className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden border border-white/5 group shadow-inner">
                                            <Image src={url} alt={`Gallery ${i} `} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gallery_urls: formData.gallery_urls.filter((_, idx) => idx !== i) })}
                                                className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square bg-white/5 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#cba36d]/10 hover:border-[#cba36d]/30 transition-all text-slate-600 hover:text-[#cba36d] group">
                                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add</span>
                                        <input type="file" className="hidden" multiple accept="image/*" onChange={e => handleImageUpload(e, 'gallery')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Similares */}
                    <section className="bg-[#0d1b2a] p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-8 overflow-hidden">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                                <span className="material-symbols-outlined">hub</span>
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Produtos Similares</h3>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {allProducts.filter((p: any) => p.id !== productId).map((p: any) => (
                                <label
                                    key={p.id}
                                    className={cn(
                                        "flex items-center gap-3 px-5 py-3 rounded-xl border transition-all cursor-pointer group/item",
                                        similarIds.includes(p.id)
                                            ? "bg-[#cba36d]/10 border-[#cba36d]/30 text-white"
                                            : "bg-slate-950/20 border-white/5 text-slate-500 hover:border-white/10"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={similarIds.includes(p.id)}
                                        onChange={() => {
                                            if (similarIds.includes(p.id)) setSimilarIds(similarIds.filter(id => id !== p.id));
                                            else setSimilarIds([...similarIds, p.id]);
                                        }}
                                    />
                                    <div className={cn(
                                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                        similarIds.includes(p.id) ? "bg-[#cba36d] border-[#cba36d]" : "border-slate-700"
                                    )}>
                                        {similarIds.includes(p.id) && <span className="material-symbols-outlined text-[10px] text-[#0d1b2a] font-black">check</span>}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest truncate">{p.name}</span>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}

// Helper para classes condicionais
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
