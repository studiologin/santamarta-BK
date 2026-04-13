"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<'admin' | 'manager' | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setUser(session.user);

                // Fetch Profile and Role
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user.id)
                    .maybeSingle();

                if (profile) {
                    setUserRole(profile.role as 'admin' | 'manager');
                } else {
                    // Default to manager if profile not found for safety
                    setUserRole('manager');
                }

                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050b14] flex flex-col md:flex-row font-sans text-white">
            {/* Top Bar Mobile */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d1b2a] border-b border-white/5 flex items-center justify-between px-6 z-[60]">
                <div className="h-8 w-32 relative">
                    <Image
                        src="https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta.png"
                        alt="Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </header>

            <aside
                className={cn(
                    "bg-[#0d1b2a] border-r border-white/5 hidden md:flex flex-col transition-all duration-500 ease-in-out relative group/sidebar h-screen sticky top-0 z-40",
                    isCollapsed ? "w-full md:w-24" : "w-full md:w-80"
                )}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 w-6 h-6 bg-[#cba36d] text-[#0d1b2a] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50 hidden md:flex"
                >
                    <span className={cn(
                        "material-symbols-outlined text-sm transition-transform duration-500",
                        isCollapsed ? "rotate-180" : ""
                    )}>
                        chevron_left
                    </span>
                </button>

                {/* Inner Scroll Container */}
                <div className={cn(
                    "flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                    isCollapsed ? "p-4 md:p-6" : "p-8"
                )}>
                    <div className={cn(
                        "flex items-center mb-12 transition-all duration-500",
                        isCollapsed ? "justify-center" : "px-2"
                    )}>
                        <div className={cn(
                            "transition-all duration-500 ease-in-out",
                            isCollapsed ? "w-16 h-16" : "w-full flex justify-start"
                        )}>
                            <Image
                                src={isCollapsed
                                    ? "https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta_coluna.png"
                                    : "https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta.png"
                                }
                                alt="Logo"
                                width={isCollapsed ? 120 : 320}
                                height={isCollapsed ? 120 : 80}
                                className={cn(
                                    "object-contain transition-all duration-500",
                                    isCollapsed ? "w-16 h-16" : "h-14 w-auto drop-shadow-2xl"
                                )}
                                priority
                            />
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className={cn(
                            "text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 transition-all duration-300",
                            isCollapsed ? "text-center opacity-0 h-0 overflow-hidden" : "ml-4 block"
                        )}>
                            MENU PRINCIPAL
                        </p>

                        <Link
                            href="/dashboard/produtos?categoria=construcao-civil"
                            className={cn(
                                "flex items-center rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group relative",
                                isCollapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-4",
                                pathname.startsWith("/dashboard/produtos") && new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoria') === 'construcao-civil'
                                    ? "bg-[#cba36d] text-[#0d1b2a] shadow-xl shadow-[#cba36d]/10"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <span className="material-symbols-outlined text-xl">architecture</span>
                            {!isCollapsed && <span>Construção Civil</span>}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-[#0d1b2a] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl border border-white/5 z-50">
                                    Construção Civil
                                </div>
                            )}
                        </Link>

                        <Link
                            href="/dashboard/produtos?categoria=geossinteticos"
                            className={cn(
                                "flex items-center rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group relative",
                                isCollapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-4",
                                pathname.startsWith("/dashboard/produtos") && new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoria') === 'geossinteticos'
                                    ? "bg-[#cba36d] text-[#0d1b2a] shadow-xl shadow-[#cba36d]/10"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <span className="material-symbols-outlined text-xl">layers</span>
                            {!isCollapsed && <span>Geossintéticos</span>}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-[#0d1b2a] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl border border-white/5 z-50">
                                    Geossintéticos
                                </div>
                            )}
                        </Link>

                        {userRole === 'admin' && (
                            <>
                                {/* 
                                <Link
                                    href="/dashboard/paginas"
                                    className={cn(
                                        "flex items-center rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group relative",
                                        isCollapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-4",
                                        pathname.startsWith("/dashboard/paginas")
                                            ? "bg-[#cba36d] text-[#0d1b2a] shadow-xl shadow-[#cba36d]/10"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-xl">web</span>
                                    {!isCollapsed && <span>Páginas</span>}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-2 bg-[#0d1b2a] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl border border-white/5 z-50">
                                            Páginas
                                        </div>
                                    )}
                                </Link>
                                */}

                                <Link
                                    href="/dashboard/monitoramento"
                                    className={cn(
                                        "flex items-center rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group relative",
                                        isCollapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-4",
                                        pathname.startsWith("/dashboard/monitoramento")
                                            ? "bg-[#cba36d] text-[#0d1b2a] shadow-xl shadow-[#cba36d]/10"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-xl">analytics</span>
                                    {!isCollapsed && <span>Monitoramento</span>}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-2 bg-[#0d1b2a] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl border border-white/5 z-50">
                                            Monitoramento
                                        </div>
                                    )}
                                </Link>

                                <Link
                                    href="/dashboard/configuracoes"
                                    className={cn(
                                        "flex items-center rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest group relative",
                                        isCollapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-4",
                                        pathname.startsWith("/dashboard/configuracoes")
                                            ? "bg-[#cba36d] text-[#0d1b2a] shadow-xl shadow-[#cba36d]/10"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-xl">settings</span>
                                    {!isCollapsed && <span>Configurações</span>}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-2 bg-[#0d1b2a] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl border border-white/5 z-50">
                                            Configurações
                                        </div>
                                    )}
                                </Link>
                            </>
                        )}
                        {/* O bloco "SISTEMA -> Ver Site Público" foi removido a pedido do usuário */}
                    </nav>

                    <div className={cn(
                        "pt-8 border-t border-white/5 mt-auto transition-all duration-300",
                        isCollapsed ? "flex flex-col items-center" : ""
                    )}>
                        <div className={cn(
                            "flex items-center px-4 mb-6 bg-white/5 rounded-2xl border border-white/5 transition-all duration-500 overflow-hidden",
                            isCollapsed ? "w-12 h-12 p-0 justify-center" : "p-4 gap-4"
                        )}>
                            <div className={cn(
                                "rounded-full bg-[#cba36d]/20 border border-[#cba36d]/30 flex items-center justify-center text-[#cba36d] font-black shrink-0 transition-all duration-500",
                                isCollapsed ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
                            )}>
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            {!isCollapsed && (
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-white uppercase tracking-tighter truncate font-black">{user?.email?.split('@')[0]}</p>
                                    <p className="text-[9px] text-[#cba36d]/80 uppercase tracking-widest font-black flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "w-full flex items-center rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest group relative",
                                isCollapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-4"
                            )}
                        >
                            <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">logout</span>
                            {!isCollapsed && <span>Sair</span>}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-red-500 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl z-50">
                                    Sair
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </aside >

            {/* Main Content */}
            < main className={
                cn(
                    "flex-1 bg-[#050b14] pt-16 md:pt-0 pb-20 md:pb-0 h-screen transition-all",
                    pathname === "/dashboard/produtos" ? "overflow-hidden flex flex-col" : "overflow-y-auto"
                )
            }>
                <div className={cn(
                    "max-w-7xl mx-auto w-full",
                    pathname === "/dashboard/produtos" ? "p-4 md:p-8 h-full flex flex-col flex-1 min-h-0" : "p-4 md:p-8"
                )}>
                    {children}
                </div>
            </main>

            {/* Bottom Nav Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0d1b2a] border-t border-white/5 flex items-center justify-around px-4 z-[60] pb-safe">
                <Link
                    href="/dashboard/produtos?categoria=construcao-civil"
                    className={cn(
                        "flex flex-col items-center gap-1 transition-all duration-300",
                        pathname.startsWith("/dashboard/produtos") && new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoria') === 'construcao-civil'
                            ? "text-[#cba36d]"
                            : "text-slate-500"
                    )}
                >
                    <span className="material-symbols-outlined text-2xl">architecture</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Civil</span>
                </Link>

                <Link
                    href="/dashboard/produtos?categoria=geossinteticos"
                    className={cn(
                        "flex flex-col items-center gap-1 transition-all duration-300",
                        pathname.startsWith("/dashboard/produtos") && new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('categoria') === 'geossinteticos'
                            ? "text-[#cba36d]"
                            : "text-slate-500"
                    )}
                >
                    <span className="material-symbols-outlined text-2xl">layers</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Geo</span>
                </Link>

                {userRole === 'admin' && (
                    <>
                        {/* 
                        <Link
                            href="/dashboard/paginas"
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                pathname.startsWith("/dashboard/paginas")
                                    ? "text-[#cba36d]"
                                    : "text-slate-500"
                            )}
                        >
                            <span className="material-symbols-outlined text-2xl">web</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Págs</span>
                        </Link>
                        */}

                        <Link
                            href="/dashboard/monitoramento"
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                pathname.startsWith("/dashboard/monitoramento")
                                    ? "text-[#cba36d]"
                                    : "text-slate-500"
                            )}
                        >
                            <span className="material-symbols-outlined text-2xl">analytics</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Monit</span>
                        </Link>

                        <Link
                            href="/dashboard/configuracoes"
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                pathname.startsWith("/dashboard/configuracoes")
                                    ? "text-[#cba36d]"
                                    : "text-slate-500"
                            )}
                        >
                            <span className="material-symbols-outlined text-2xl">settings</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Config</span>
                        </Link>
                    </>
                )}

                {/* Link "Site" removido a pedido do usuário */}



                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-1 text-red-500/70"
                >
                    <span className="material-symbols-outlined text-2xl">logout</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Sair</span>
                </button>
            </nav >
        </div >
    );
}

