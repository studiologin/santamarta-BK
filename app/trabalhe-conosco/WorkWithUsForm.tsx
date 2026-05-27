"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export default function WorkWithUsForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setFileError("");
    const validTypes = [
      "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setFileError("Por favor, envie apenas arquivos .pdf, .doc ou .docx");
      setFile(null);
      return;
    }

    // Limite de 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("O arquivo deve ter no máximo 5MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setFileError("Por favor, anexe o seu currículo.");
      return;
    }

    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    
    try {
      // 1. Upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('curriculos')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Erro ao fazer upload do currículo.");
      }

      // 2. Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('curriculos')
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      // 3. Send data to webhook
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        area: formData.get("area") as string,
        message: formData.get("message") as string,
        resume_url: fileUrl,
      };

      // 4. Save data to Supabase Database
      const { error: dbError } = await supabase
        .from('work_with_us_applications')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          area: data.area,
          message: data.message,
          resume_url: data.resume_url
        }]);

      if (dbError) {
        console.error("Database Error:", dbError);
        throw new Error("Erro ao salvar cadastro no banco de dados.");
      }

      // 5. Trigger n8n Webhook
      const response = await fetch("https://n8n.studiologin.com.br/webhook/trabelhesantamarta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        setFile(null);
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-primary/5 p-8 lg:p-12 rounded-xl border border-primary/20 backdrop-blur-sm self-start">
      <h3 className="text-white text-2xl font-bold mb-2 font-display">Faça parte da nossa equipe</h3>
      <p className="text-slate-400 mb-10">Preencha o formulário abaixo e anexe o seu currículo. Entraremos em contato assim que surgir uma oportunidade com o seu perfil.</p>
      
      {status === "success" ? (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-xl text-center">
          <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
          <p className="font-bold">Currículo enviado com sucesso!</p>
          <p className="text-sm mt-2 opacity-80">Agradecemos o interesse em fazer parte da Santa Marta Engenharia.</p>
          <button 
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm text-green-400 hover:text-green-300 underline"
          >
            Enviar novo currículo
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
            <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="area">Área de Interesse</label>
            <div className="relative">
              <select name="area" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 appearance-none outline-none transition-all" id="area">
                <option value="Engenharia">Engenharia</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Comercial">Comercial</option>
                <option value="Operacional">Operacional</option>
                <option value="Outros">Outros</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
          
          <div className="group">
            <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display">Anexar Currículo (.pdf, .doc, .docx)</label>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-background-dark/50 border-2 border-dashed border-primary/30 hover:border-primary text-slate-100 rounded-xl p-8 outline-none transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              />
              <span className="material-symbols-outlined text-4xl text-primary/70">upload_file</span>
              {file ? (
                <div>
                  <p className="text-primary font-bold">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-300 font-semibold">Clique ou arraste o arquivo aqui</p>
                  <p className="text-xs text-slate-500 mt-1">Formatos aceitos: PDF, DOC, DOCX (Máx 5MB)</p>
                </div>
              )}
            </div>
            {fileError && <p className="text-red-400 text-sm mt-2">{fileError}</p>}
          </div>

          <div className="group">
            <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="message">Apresentação / Mensagem Opcional</label>
            <textarea name="message" className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all resize-none" id="message" placeholder="Fale um pouco sobre você..." rows={4}></textarea>
          </div>
          
          {status === "error" && (
            <p className="text-red-400 text-sm">Ocorreu um erro ao enviar o currículo. Verifique se os dados estão corretos ou tente novamente mais tarde.</p>
          )}

          <button disabled={status === "submitting"} className="w-full bg-primary text-background-dark font-bold py-4 rounded hover:brightness-110 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group font-display disabled:opacity-70 disabled:cursor-not-allowed" type="submit">
            {status === "submitting" ? "Enviando..." : "Enviar Currículo"}
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              {status === "submitting" ? "hourglass_empty" : "send"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
