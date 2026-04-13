import Link from "next/link";
import Image from "next/image";
import { VideoSection } from "@/components/video-section";
import { ScrollBanner } from "@/components/scroll-banner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Scroll Animated Hero Banner */}
      <ScrollBanner />

      {/* Numbers Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-16 md:pt-24 mb-16 md:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-surface-blue/95 backdrop-blur-xl border border-white/5 shadow-2xl rounded-xl relative z-10">
          <div className="p-8 flex flex-col items-center text-center">
            <span className="text-primary text-4xl font-bold mb-1 font-industrial tracking-tighter">+40</span>
            <span className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Anos de Mercado</span>
          </div>
          <div className="p-8 flex flex-col items-center text-center border-l border-white/5">
            <span className="text-primary text-4xl font-bold mb-1 font-industrial tracking-tighter">+500</span>
            <span className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Projetos Concluídos</span>
          </div>
          <div className="p-8 flex flex-col items-center text-center border-l border-white/5">
            <span className="text-primary text-4xl font-bold mb-1 font-industrial tracking-tighter">+200</span>
            <span className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Clientes Ativos</span>
          </div>
          <div className="p-8 flex flex-col items-center text-center border-l border-white/5">
            <span className="text-primary text-4xl font-bold mb-1 font-industrial tracking-tighter">26</span>
            <span className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Estados Atendidos</span>
          </div>
        </div>
      </section>

      {/* 2. About Preview Section (Nossa História) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Nossa História</span>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase font-industrial leading-tight">
                Mais de três décadas de <br /><span className="text-primary">engenharia de precisão</span>
              </h3>
            </div>
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              Fundada em 1986, a Santa Marta consolidou-se como referência nacional em soluções de engenharia e geossintéticos. Com um compromisso inabalável com a qualidade e a inovação tecnológica, transformamos desafios complexos em projetos de infraestrutura duradouros e sustentáveis em todo o território brasileiro.
            </p>
            <div className="pt-4">
              <Link href="/sobre">
                <button className="bg-primary text-background-dark px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(204,166,114,0.3)] transition-all duration-300">
                  Conheça nossa história
                </button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative">
              <Image
                src="/images/products/engineering_consultancy_professional_construction_office_plans_site_visit_1772753110437.png"
                alt="História Santa Marta"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-lg shadow-2xl z-10">
              <span className="block text-background-dark text-4xl font-black font-industrial">38+</span>
              <span className="block text-background-dark/80 text-[10px] font-bold uppercase tracking-widest">Anos de Experiência</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Institucional (Consultoria + Video) */}
      <section className="py-24 bg-surface-blue/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">engineering</span>
                <h5 className="text-white font-bold uppercase tracking-widest text-sm">Consultoria Especializada</h5>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-light">Desenvolvimento de projetos executivos com rigor técnico e foco na otimização de custos e recursos para grandes obras de infraestrutura.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">layers</span>
                <h5 className="text-white font-bold uppercase tracking-widest text-sm">Materiais Premium</h5>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-light">Distribuição estratégica de geossintéticos de alta performance, garantindo a integridade ambiental e estrutural de cada aplicação.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">construction</span>
                <h5 className="text-white font-bold uppercase tracking-widest text-sm">Execução Técnica</h5>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-light">Instalação especializada com equipes certificadas, utilizando equipamentos de ponta para assegurar a máxima eficiência no canteiro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Preview Section (Nossas Especialidades) */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Soluções</span>
            <h3 className="text-4xl font-black text-white uppercase font-industrial">Nossas Especialidades</h3>
          </div>
          <Link href="/servicos" className="text-primary font-bold border-b border-primary/30 pb-1 hover:border-primary transition-all uppercase tracking-widest text-sm">
            Ver todos os serviços
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Product Line 1: Construção Civil */}
          <div className="bg-slate-900/40 border-t-4 border-primary p-10 space-y-6 hover:bg-slate-900/60 transition-all group">
            <span className="material-symbols-outlined text-5xl text-primary/50 group-hover:text-primary transition-colors">apartment</span>
            <h4 className="text-2xl font-bold text-white uppercase tracking-tight font-industrial">Construção Civil</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Soluções integradas para o setor construtivo, desde reforço de solos até sistemas de drenagem predial, unindo tecnologia industrial à agilidade exigida pelo mercado civil.
            </p>
            <div className="pt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Link href="/construcao-civil" className="flex items-center gap-2">
                Ver Produtos <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
          {/* Product Line 2: Geossintéticos */}
          <div className="bg-slate-900/40 border-t-4 border-primary p-10 space-y-6 hover:bg-slate-900/60 transition-all group">
            <span className="material-symbols-outlined text-5xl text-primary/50 group-hover:text-primary transition-colors">grid_view</span>
            <h4 className="text-2xl font-bold text-white uppercase tracking-tight font-industrial">Geossintéticos</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Linha completa de geomembranas, geotêxteis e geogrelhas. Referência técnica em impermeabilização e contenção para proteção ambiental e obras de terra.
            </p>
            <div className="pt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Link href="/geossinteticos" className="flex items-center gap-2">
                Ver Produtos <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
          {/* Service Support */}
          <div className="bg-slate-900/40 border-t-4 border-white/20 p-10 space-y-6 hover:bg-slate-900/60 transition-all group">
            <span className="material-symbols-outlined text-5xl text-white/30 group-hover:text-primary transition-colors">handshake</span>
            <h4 className="text-2xl font-bold text-white uppercase tracking-tight font-industrial">Engenharia Consultiva</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Suporte técnico especializado para a correta especificação e aplicação de nossas linhas de produtos, garantindo performance e conformidade normativa.
            </p>
            <div className="pt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Link href="/contato" className="flex items-center gap-2">
                Falar com Especialista <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection videoId="2uU_WrANmxI" />
    </div>
  );
}
