"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("https://n8n.studiologin.com.br/webhook/formuariodecontato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-primary/5 p-8 lg:p-12 rounded-xl border border-primary/20 backdrop-blur-sm self-start">
      <h3 className="text-white text-2xl font-bold mb-2 font-display">Envie uma Mensagem</h3>
      <p className="text-slate-400 mb-10">Preencha o formulário abaixo e retornaremos em breve.</p>
      
      {status === "success" ? (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-xl text-center">
          <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
          <p className="font-bold">Mensagem enviada com sucesso!</p>
          <p className="text-sm mt-2 opacity-80">Retornaremos o seu contato em breve.</p>
          <button 
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm text-green-400 hover:text-green-300 underline"
          >
            Enviar nova mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="name">Nome Completo</label>
            <input required name="name" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all" id="name" placeholder="Ex: João Silva" type="text" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="email">E-mail</label>
              <input required name="email" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all" id="email" placeholder="joao@exemplo.com" type="email" />
            </div>
            <div className="group">
              <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="phone">Telefone</label>
              <input required name="phone" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all" id="phone" placeholder="(71) 90000-0000" type="tel" />
            </div>
          </div>
          <div className="group">
            <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="subject">Assunto</label>
            <div className="relative">
              <select name="subject" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 appearance-none outline-none transition-all" id="subject">
                <option value="Geossintéticos">Geossintéticos</option>
                <option value="Construção Civil">Construção Civil</option>
                <option value="Engenharia Consultiva">Engenharia Consultiva</option>
                <option value="Outros Assuntos">Outros Assuntos</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
          <div className="group">
            <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="message">Mensagem</label>
            <textarea required name="message" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all resize-none" id="message" placeholder="Como podemos ajudar?" rows={5}></textarea>
          </div>
          
          {status === "error" && (
            <p className="text-red-400 text-sm">Ocorreu um erro ao enviar a mensagem. Tente novamente.</p>
          )}

          <button disabled={status === "submitting"} className="w-full bg-primary text-background-dark font-bold py-4 rounded hover:brightness-110 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group font-display disabled:opacity-70 disabled:cursor-not-allowed" type="submit">
            {status === "submitting" ? "Enviando..." : "Enviar Mensagem"}
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              {status === "submitting" ? "hourglass_empty" : "send"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
