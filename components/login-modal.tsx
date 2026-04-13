"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberEmail, setRememberEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Bloquear scroll quando aberto
    useEffect(() => {
        if (isOpen) {
            const savedEmail = localStorage.getItem("rememberedEmail");
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberEmail(true);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Log failed attempt
                await supabase.from("auth_audit_log").insert({
                    email,
                    event_type: 'failed_login',
                    user_agent: navigator.userAgent
                });
                throw error;
            }

            // Log success event
            if (data?.user) {
                if (rememberEmail) {
                    localStorage.setItem("rememberedEmail", email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                await supabase.from("auth_audit_log").insert({
                    user_id: data.user.id,
                    email: data.user.email,
                    event_type: 'login',
                    user_agent: navigator.userAgent
                });
            }

            onClose();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative max-w-[440px] w-full bg-[#0d1b2a] p-5 sm:p-10 rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-4 sm:mb-8">
                    <div className="flex justify-center mb-3 sm:mb-6">
                        <Image
                            src="https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta.png"
                            alt="Santa Marta Engenharia"
                            width={160}
                            height={40}
                            className="w-auto h-8 sm:h-12 object-contain"
                        />
                    </div>
                    <h2 className="text-xl sm:text-[28px] font-bold text-white tracking-tight">
                        Acesso Restrito
                    </h2>
                </div>

                <form className="space-y-4 sm:space-y-8" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3 sm:space-y-6">
                        <div>
                            <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1.5 sm:mb-3 block">
                                E-MAIL CORPORATIVO
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#e8f0fe] rounded-xl px-4 py-2.5 sm:px-5 sm:py-4 text-[#0d1b2a] font-semibold text-sm sm:text-lg focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400/50"
                                placeholder="contato@studiologin.com.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1.5 sm:mb-3 block">
                                PALAVRA-PASSE
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-[#e8f0fe] rounded-xl px-4 py-2.5 sm:px-5 sm:py-4 text-[#0d1b2a] font-semibold text-sm sm:text-lg focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0d1b2a]/50 hover:text-[#0d1b2a] transition-colors p-2"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={rememberEmail}
                                        onChange={(e) => setRememberEmail(e.target.checked)}
                                    />
                                    <div className={`w-8 h-4 sm:w-10 sm:h-5 rounded-full transition-colors duration-300 ${rememberEmail ? 'bg-[#cba36d]' : 'bg-slate-700'}`}></div>
                                    <div className={`absolute left-0.5 top-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-300 ${rememberEmail ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-[9px] sm:text-[11px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                                    Lembrar de mim
                                </span>
                            </label>

                            <Link
                                href="/recuperar-senha"
                                onClick={onClose}
                                className="text-[9px] sm:text-[11px] font-bold text-[#cba36d] hover:text-[#b8925c] uppercase tracking-widest transition-colors"
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#cba36d] text-[#0d1b2a] py-3.5 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-[#b8925c] transition-all disabled:opacity-50 shadow-xl shadow-black/40 mt-1 sm:mt-4"
                    >
                        {loading ? "PROCESSANDO..." : "ENTRAR"}
                    </button>
                </form>
            </div>
        </div>
    );
}
