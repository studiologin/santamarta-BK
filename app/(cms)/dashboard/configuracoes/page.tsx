"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { logAction } from "@/utils/logger";
import { X, Eye, EyeOff, UserPlus, Shield, User as UserIcon, Trash2, Edit2, AlertTriangle, User, Phone } from "lucide-react";

type Tab = "usuarios" | "historico";

export default function ConfiguracoesPage() {
    const [activeTab, setActiveTab] = useState<Tab>("usuarios");
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>("");

    // Users state
    const [profiles, setProfiles] = useState<any[]>([]);

    // Logs state
    const [logs, setLogs] = useState<any[]>([]);
    const [filterEmail, setFilterEmail] = useState("");
    const [filterAction, setFilterAction] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        role: "manager" as "admin" | "manager"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState(false);

    // Edit Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editRole, setEditRole] = useState<"admin" | "manager">("manager");
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");

    // Delete Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<any>(null);

    const supabase = createClient();

    const fetchProfilesAndLogs = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Check role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle();

        if (profile?.role !== "admin") {
            setLoading(false);
            return;
        }
        setUserRole("admin");

        // Fetch Profiles
        const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("*");

        if (profilesError) {
            console.error("Erro ao buscar perfis:", profilesError);
        }
        setProfiles(profilesData || []);

        // Fetch Logs
        const { data: logsData } = await supabase
            .from("user_actions_log")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);
        setLogs(logsData || []);

        setLoading(false);
    };

    useEffect(() => {
        fetchProfilesAndLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchEmail = filterEmail === "" || (log.email && log.email.toLowerCase().includes(filterEmail.toLowerCase()));
        const matchAction = filterAction === "" || (log.action && log.action.toLowerCase().includes(filterAction.toLowerCase()));
        return matchEmail && matchAction;
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalLoading(true);
        setModalError(null);
        setModalSuccess(false);

        try {
            // 1. Call secure Admin API route
            const response = await fetch("/api/admin/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: newUser.email,
                    password: newUser.password,
                    full_name: newUser.full_name,
                    phone: newUser.phone,
                    role: newUser.role,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erro ao criar usuário.");
            }

            // 2. Log Action
            await logAction({
                action: 'CREATE',
                entityType: 'user',
                entityName: newUser.email,
                details: { role: newUser.role }
            });

            setModalSuccess(true);
            setNewUser({ email: "", password: "", full_name: "", phone: "", role: "manager" });

            // Refresh profiles
            fetchProfilesAndLogs();

            // Close modal after delay
            setTimeout(() => {
                setIsModalOpen(false);
                setModalSuccess(false);
            }, 2000);
        } catch (err: any) {
            setModalError(err.message || "Erro ao criar usuário");
        } finally {
            setModalLoading(false);
        }
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setEditRole(user.role as "admin" | "manager");
        setEditName(user.full_name || "");
        setEditPhone(user.phone || "");
        setModalError(null);
        setModalSuccess(false);
        setIsEditModalOpen(true);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo o que não é dígito

        if (value.length <= 11) {
            // Formatar como (00) 00000-0000
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d{5})(\d)/, "$1-$2");
        }

        setEditPhone(value);
    };

    const handleNewUserPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo o que não é dígito

        if (value.length <= 11) {
            // Formatar como (00) 00000-0000
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d{5})(\d)/, "$1-$2");
        }

        setNewUser(prev => ({ ...prev, phone: value }));
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setModalLoading(true);
        setModalError(null);

        try {
            // Update profile role and details
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    role: editRole,
                    full_name: editName,
                    phone: editPhone
                })
                .eq("id", editingUser.id);

            if (updateError) throw updateError;

            // Log Action
            await logAction({
                action: 'UPDATE',
                entityType: 'user',
                entityName: editingUser.email || editingUser.full_name,
                details: { old_role: editingUser.role, new_role: editRole }
            });

            setModalSuccess(true);

            // Refresh profiles
            fetchProfilesAndLogs();

            setTimeout(() => {
                setIsEditModalOpen(false);
                setModalSuccess(false);
                setEditingUser(null);
            }, 2000);

        } catch (err: any) {
            setModalError(err.message || "Erro ao atualizar usuário");
        } finally {
            setModalLoading(false);
        }
    };

    const openDeleteModal = (user: any) => {
        setDeletingUser(user);
        setModalError(null);
        setModalSuccess(false);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;

        setModalLoading(true);
        setModalError(null);

        try {
            // Call our secure Admin API route to delete from auth.users
            // This requires the SUPABASE_SERVICE_ROLE_KEY environment variable.
            const response = await fetch("/api/admin/users/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: deletingUser.id, targetRole: deletingUser.role }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erro ao excluir usuário.");
            }

            // Log Action
            await logAction({
                action: 'DELETE',
                entityType: 'user',
                entityName: deletingUser.email || deletingUser.full_name,
                details: { user_id: deletingUser.id }
            });

            setModalSuccess(true);

            // Refresh profiles
            fetchProfilesAndLogs();

            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setModalSuccess(false);
                setDeletingUser(null);
            }, 2000);

        } catch (err: any) {
            setModalError(err.message || "Erro ao excluir usuário");
        } finally {
            setModalLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-[#cba36d]/20 border-t-[#cba36d] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Acessando sistema...</p>
            </div>
        );
    }

    if (userRole !== "admin") {
        return (
            <div className="p-20 text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-red-500/50">lock</span>
                <h1 className="text-2xl font-bold text-white">Acesso Restrito</h1>
                <p className="text-slate-400">Apenas administradores podem acessar esta área.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col relative">
            <div className="sticky top-0 z-20 bg-[#050b14]/95 backdrop-blur-md pb-4 pt-4 md:pt-0 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                    <div>
                        <span className="text-[10px] font-black text-[#cba36d] uppercase tracking-[0.3em] mb-2 block">
                            GESTÃO DO SISTEMA
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-4">
                            Configurações
                        </h1>
                        <div className="h-1 w-16 bg-gradient-to-r from-[#cba36d] to-transparent rounded-full"></div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 bg-[#0d1b2a]/50 p-1 rounded-2xl w-full md:w-fit border border-white/5 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setActiveTab("usuarios")}
                            className={`flex-1 md:flex-none justify-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "usuarios" ? "bg-[#cba36d] text-[#0d1b2a]" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">group</span>
                            Usuários
                        </button>
                        <button
                            onClick={() => setActiveTab("historico")}
                            className={`flex-1 md:flex-none justify-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "historico" ? "bg-[#cba36d] text-[#0d1b2a]" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">history</span>
                            Histórico de Ações
                        </button>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-visible min-h-0">
                {activeTab === "usuarios" && (
                    <div className="bg-[#0d1b2a] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Usuários do Painel</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchProfilesAndLogs}
                                    className="bg-white/5 text-slate-400 p-3 rounded-full hover:bg-white/10 hover:text-white transition-all flex items-center justify-center group"
                                    title="Atualizar Lista"
                                >
                                    <span className={cn("material-symbols-outlined text-lg", loading && "animate-spin")}>refresh</span>
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#cba36d]/10 text-[#cba36d] px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#cba36d]/20 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">person_add</span>
                                    Novo Usuário
                                </button>
                            </div>
                        </div>
                        <div className="overflow-auto custom-scrollbar flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0d1b2a] z-10">
                                    <tr className="border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Usuário</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Função</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.map((profile) => (
                                        <tr key={profile.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">
                                                        {profile.full_name || profile.email || "Sem nome"}
                                                    </span>
                                                    <span className="text-slate-400 text-[11px] mt-0.5">
                                                        {profile.full_name ? profile.email : profile.id.substring(0, 8) + "..."}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${profile.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                                    }`}>
                                                    {profile.role === 'admin' ? 'Administrador' : 'Gerente'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(profile)}
                                                        className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-[#0d1b2a] transition-all flex items-center justify-center p-0"
                                                        title="Editar Função"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(profile)}
                                                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center p-0"
                                                        title="Excluir Usuário"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {profiles.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                Nenhum usuário encontrado
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "historico" && (
                    <div className="bg-[#0d1b2a] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Histórico de Atividades</h3>
                            <button
                                onClick={fetchProfilesAndLogs}
                                className="bg-white/5 text-slate-400 p-3 rounded-full hover:bg-white/10 hover:text-white transition-all flex items-center justify-center group"
                                title="Atualizar Histórico"
                            >
                                <span className={cn("material-symbols-outlined text-lg", loading && "animate-spin")}>refresh</span>
                            </button>
                        </div>

                        <div className="p-8 border-b border-white/5 bg-white/5 space-y-6">

                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#cba36d] transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="Filtrar por Usuário (e-mail)..."
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 text-xs font-bold"
                                        value={filterEmail}
                                        onChange={e => setFilterEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">dynamic_feed</span>
                                    <input
                                        type="text"
                                        placeholder="Filtrar por Ação (CREATE, UPDATE...)..."
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 text-xs font-bold font-mono"
                                        value={filterAction}
                                        onChange={e => setFilterAction(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-auto custom-scrollbar flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0d1b2a] z-10">
                                    <tr className="border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Data/Hora</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Usuário</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ação</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Recurso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="text-slate-400 text-[11px] font-mono">
                                                    {format(new Date(log.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-white font-bold text-xs">{log.email || "Sistema"}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${log.action === 'DELETE' ? 'bg-red-500/10 text-red-500' :
                                                    log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        log.action === 'UPDATE' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col max-w-[200px] truncate">
                                                    <span className="text-white font-medium text-[11px] truncate">{log.entity_name || '-'}</span>
                                                    <span className="text-slate-500 text-[9px] uppercase tracking-tighter">{log.entity_type || '-'}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredLogs.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                Nenhum registro encontrado
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Novo Usuário */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                        onClick={() => !modalLoading && setIsModalOpen(false)}
                    />

                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0d1b2a] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#cba36d]/10 flex items-center justify-center text-[#cba36d]">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Novo Usuário</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateUser} className="p-6 sm:p-8 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {modalError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center font-bold">
                                    {modalError}
                                </div>
                            )}

                            {modalSuccess && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Usuário criado com sucesso!
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        Nome Completo
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#cba36d] transition-colors">person</span>
                                        <input
                                            type="text"
                                            required
                                            value={newUser.full_name}
                                            onChange={e => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                                            placeholder="Nome do usuário"
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        Contato (Telefone/WhatsApp)
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#cba36d] transition-colors">phone</span>
                                        <input
                                            type="text"
                                            required
                                            maxLength={15}
                                            value={newUser.phone}
                                            onChange={handleNewUserPhoneChange}
                                            placeholder="(00) 00000-0000"
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        E-mail de Acesso
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#cba36d] transition-colors">mail</span>
                                        <input
                                            type="email"
                                            required
                                            value={newUser.email}
                                            onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="exemplo@santamarta.com"
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        Senha Inicial
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#cba36d] transition-colors">lock</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={newUser.password}
                                            onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-white focus:border-[#cba36d]/50 outline-none transition-all placeholder:text-slate-700 text-sm font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewUser(prev => ({ ...prev, role: "manager" }))}
                                        className={cn(
                                            "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                                            newUser.role === "manager"
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                                : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                                        )}
                                    >
                                        <UserIcon className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Gerente</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewUser(prev => ({ ...prev, role: "admin" }))}
                                        className={cn(
                                            "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                                            newUser.role === "admin"
                                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                                : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                                        )}
                                    >
                                        <Shield className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Administrador</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={modalLoading || modalSuccess}
                                className="w-full bg-[#cba36d] text-[#0d1b2a] py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:bg-[#b8925c] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                            >
                                {modalLoading ? (
                                    <div className="w-5 h-5 border-2 border-[#0d1b2a]/20 border-t-[#0d1b2a] rounded-full animate-spin" />
                                ) : modalSuccess ? (
                                    "USUÁRIO CRIADO!"
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        CRIAR ACESSO
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Edição de Usuário */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                        onClick={() => !modalLoading && setIsEditModalOpen(false)}
                    />

                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0d1b2a] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Edit2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Editar Usuário</h3>
                                    <p className="text-xs text-slate-400 mt-1">{editingUser.email || editingUser.full_name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditUser} className="p-6 sm:p-8 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {modalError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center font-bold">
                                    {modalError}
                                </div>
                            )}

                            {modalSuccess && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Usuário atualizado com sucesso!
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        Nome Completo
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">person</span>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            placeholder="Nome do usuário"
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="opacity-50">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        E-mail de Acesso (Não alterável)
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">mail</span>
                                        <input
                                            type="email"
                                            disabled
                                            value={editingUser?.email || ''}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white outline-none cursor-not-allowed text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        Contato (Telefone/WhatsApp)
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">phone</span>
                                        <input
                                            type="text"
                                            value={editPhone}
                                            onChange={handlePhoneChange}
                                            maxLength={15}
                                            placeholder="(00) 00000-0000"
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 mb-2 block">
                                        Nível de Acesso (Função)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEditRole("manager")}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                                                editRole === "manager"
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                                    : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                                            )}
                                        >
                                            <UserIcon className="w-6 h-6" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Gerente</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditRole("admin")}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                                                editRole === "admin"
                                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                                    : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                                            )}
                                        >
                                            <Shield className="w-6 h-6" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Administrador</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={modalLoading || modalSuccess || (editRole === editingUser.role && editName === (editingUser.full_name || "") && editPhone === (editingUser.phone || ""))}
                                className="w-full bg-emerald-500 text-[#0d1b2a] py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                            >
                                {modalLoading ? (
                                    <div className="w-5 h-5 border-2 border-[#0d1b2a]/20 border-t-[#0d1b2a] rounded-full animate-spin" />
                                ) : modalSuccess ? (
                                    "SALVO!"
                                ) : (
                                    <>
                                        <Edit2 className="w-5 h-5" />
                                        SALVAR ALTERAÇÕES
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Exclusão de Usuário */}
            {isDeleteModalOpen && deletingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                        onClick={() => !modalLoading && setIsDeleteModalOpen(false)}
                    />

                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0d1b2a] rounded-[32px] border border-red-500/20 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-red-500/5 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Excluir Usuário</h3>
                                    <p className="text-xs text-red-400 mt-1">Ação irreversível</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {modalError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center font-bold">
                                    {modalError}
                                </div>
                            )}

                            {modalSuccess ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-4 rounded-xl text-center font-bold flex flex-col items-center justify-center gap-2 py-8">
                                    <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                    Usuário excluído com sucesso!
                                </div>
                            ) : (
                                <>
                                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                            Você tem certeza que deseja excluir o usuário abaixo? Esta ação revogará imediatamente o acesso dele ao sistema.
                                        </p>
                                        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{deletingUser.email || deletingUser.full_name}</p>
                                                <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">{deletingUser.role}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsDeleteModalOpen(false)}
                                            disabled={modalLoading}
                                            className="w-full bg-white/5 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteUser}
                                            disabled={modalLoading}
                                            className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {modalLoading ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4" />
                                                    Sim, Excluir
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
