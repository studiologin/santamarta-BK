import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('pages').select('content').eq('slug', 'contato').single();
  const content = data?.content || {};

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image
            alt="Modern corporate office interior with gold accents"
            className="object-cover grayscale brightness-[0.35] contrast-125"
            src="https://picsum.photos/seed/contact-hero/1920/1080"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-12 text-primary text-xs font-bold tracking-[0.4em] uppercase">
            <Link className="hover:text-white transition-colors" href="/">Home</Link>
            <span className="text-[8px]">●</span>
            <span className="text-primary">Contato</span>
          </div>
          <div className="max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight text-white mb-6 uppercase font-industrial leading-[1.05] opacity-95 drop-shadow-lg">
              Fale <br />
              <span className="text-primary">Conosco</span>
            </h1>
            <div className="h-1 w-24 bg-primary mb-10"></div>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed drop-shadow">
              Atendimento especializado para soluções de engenharia e geossintéticos. Nossa equipe está pronta para impulsionar seu projeto.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      < div className="max-w-7xl mx-auto px-6 py-16 lg:py-24" >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Contact Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-primary text-2xl font-bold mb-8 flex items-center gap-3 font-display">
                <span className="w-8 h-[1px] bg-primary"></span>
                Nossos Canais
              </h3>
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-5">
                  <div className="text-primary bg-primary/10 rounded p-3 flex items-center justify-center">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-slate-100 text-lg font-semibold font-display">Telefone</p>
                    {content.phone ? (
                      <p className="text-slate-400 mt-1"><a href={`tel:${content.phone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">{content.phone}</a></p>
                    ) : (
                      <>
                        <p className="text-slate-400 mt-1"><a href="tel:+5571987203123" className="hover:text-primary transition-colors">Matriz: (071) 98720-3123</a></p>
                        <p className="text-slate-400"><a href="tel:+5581992578686" className="hover:text-primary transition-colors">Filial Recife: (081) 99257-8686</a></p>
                      </>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start gap-5">
                  <div className="text-primary bg-primary/10 rounded p-3 flex items-center justify-center">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-slate-100 text-lg font-semibold font-display">E-mail</p>
                    <p className="text-slate-400 mt-1"><a href={`mailto:${content.email || 'contato@santamartageossinteticos.com.br'}`} className="hover:text-primary transition-colors">{content.email || 'contato@santamartageossinteticos.com.br'}</a></p>
                  </div>
                </div>
                {/* Hours */}
                <div className="flex items-start gap-5">
                  <div className="text-primary bg-primary/10 rounded p-3 flex items-center justify-center">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="text-slate-100 text-lg font-semibold font-display">Horário de Atendimento</p>
                    <p className="text-slate-400 mt-1">Segunda a Sexta: 08:00 às 18:00</p>
                    <p className="text-slate-400">Sábado: 09:00 às 12:00</p>
                  </div>
                </div>
              </div>
            </div>



            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden grayscale contrast-125 opacity-70 hover:opacity-100 transition-opacity h-64 relative bg-primary/5 border border-primary/20">
              <Image
                src="https://picsum.photos/seed/map-location/800/600"
                alt="Stylized map showing business location"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-primary text-background-dark p-2 rounded-full shadow-xl z-10">
                  <span className="material-symbols-outlined text-3xl">location_on</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-primary/5 p-8 lg:p-12 rounded-xl border border-primary/20 backdrop-blur-sm self-start">
            <h3 className="text-white text-2xl font-bold mb-2 font-display">Envie uma Mensagem</h3>
            <p className="text-slate-400 mb-10">Preencha o formulário abaixo e retornaremos em breve.</p>
            <form action="https://formspree.io/f/vendas@santamartageo.com.br" method="POST" className="space-y-6">
              <div className="group">
                <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="name">Nome Completo</label>
                <input className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all" id="name" placeholder="Ex: João Silva" type="text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="email">E-mail</label>
                  <input className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all" id="email" placeholder="joao@exemplo.com" type="email" />
                </div>
                <div className="group">
                  <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="phone">Telefone</label>
                  <input className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all" id="phone" placeholder="(71) 90000-0000" type="tel" />
                </div>
              </div>
              <div className="group">
                <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="subject">Assunto</label>
                <div className="relative">
                  <select className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 appearance-none outline-none transition-all" id="subject">
                    <option>Geossintéticos</option>
                    <option>Construção Civil</option>
                    <option>Engenharia Consultiva</option>
                    <option>Outros Assuntos</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="group">
                <label className="block text-primary text-xs font-bold uppercase tracking-widest mb-2 font-display" htmlFor="message">Mensagem</label>
                <textarea className="w-full bg-background-dark/50 border border-primary/30 text-slate-100 rounded focus:ring-1 focus:ring-primary focus:border-primary py-3 px-4 placeholder:text-slate-600 outline-none transition-all resize-none" id="message" placeholder="Como podemos ajudar?" rows={5}></textarea>
              </div>
              <button className="w-full bg-primary text-background-dark font-bold py-4 rounded hover:brightness-110 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group font-display" type="submit">
                Enviar Mensagem
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
              </button>
            </form>
          </div>
        </div>
      </div >
    </div >
  )
}
