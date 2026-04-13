"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus({ type: 'error', text: "As senhas não coincidem" });
            return;
        }

        if (password.length < 6) {
            setStatus({ type: 'error', text: "A senha deve ter pelo menos 6 caracteres" });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setStatus({
                type: 'success',
                text: "Senha redefinida com sucesso! Você será redirecionado em instantes."
            });

            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (err: any) {
            setStatus({
                type: 'error',
                text: err.message || "Erro ao redefinir senha"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050b14] px-6">
            <div className="max-w-[440px] w-full bg-[#0d1b2a] p-12 rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
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
                        Nova Senha
                    </h2>
                    <p className="text-slate-400 text-sm mt-4">
                        Crie uma nova senha segura para sua conta.
                    </p>
                </div>

                {status?.type === 'success' ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center text-emerald-500">
                            <CheckCircle2 size={64} />
                        </div>
                        <p className="text-white font-medium">{status.text}</p>
                    </div>
                ) : (
                    <form className="space-y-8" onSubmit={handleReset}>
                        {status?.type === 'error' && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center font-bold">
                                {status.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">
                                    NOVA PALAVRA-PASSE
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-[#e8f0fe] rounded-xl px-5 py-5 text-[#0d1b2a] font-semibold text-lg focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0d1b2a]/50 hover:text-[#0d1b2a] transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">
                                    CONFIRMAR PALAVRA-PASSE
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-[#e8f0fe] rounded-xl px-5 py-5 text-[#0d1b2a] font-semibold text-lg focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#cba36d] text-[#0d1b2a] py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#b8925c] transition-all disabled:opacity-50 shadow-xl shadow-black/40 mt-4 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                "ATUALIZANDO..."
                            ) : (
                                <>
                                    <Save size={18} />
                                    DEFINIR SENHA
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
