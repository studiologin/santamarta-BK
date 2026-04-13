"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function RecoverPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/redefinir-senha`,
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: "Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes."
            });
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.message || "Erro ao processar solicitação"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050b14] px-6">
            <div className="max-w-[440px] w-full bg-[#0d1b2a] p-12 rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <div className="mb-8">
                    <Link href="/login" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 group text-sm uppercase tracking-widest font-bold">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar para Login
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta.png"
                            alt="Santa Marta Engenharia"
                            width={180}
                            height={48}
                            className="w-auto h-16 object-contain"
                        />
                    </div>
                    <h2 className="text-[28px] font-bold text-white tracking-tight">
                        Recuperar Senha
                    </h2>
                    <p className="text-slate-400 text-sm mt-4">
                        Insira seu e-mail corporativo para receber as instruções de redefinição.
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleResetRequest}>
                    {message && (
                        <div className={`p-4 rounded-xl text-xs text-center font-bold border ${message.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">
                            E-MAIL CORPORATIVO
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-[#e8f0fe] rounded-xl px-5 py-5 text-[#0d1b2a] font-semibold text-lg focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400/50"
                            placeholder="seu-email@santamartageo.com.br"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#cba36d] text-[#0d1b2a] py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#b8925c] transition-all disabled:opacity-50 shadow-xl shadow-black/40 mt-4 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            "PROCESSANDO..."
                        ) : (
                            <>
                                <Send size={18} />
                                ENVIAR LINK
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
