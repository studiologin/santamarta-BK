import Link from "next/link";
import Image from "next/image";
import WorkWithUsForm from "./WorkWithUsForm";

export default function WorkWithUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image
            alt="Profissionais trabalhando na Santa Marta Engenharia"
            className="object-cover grayscale brightness-[0.35] contrast-125"
            src="https://picsum.photos/seed/work-with-us/1920/1080"
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
            <span className="text-primary">Trabalhe Conosco</span>
          </div>
          <div className="max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight text-white mb-6 uppercase font-industrial leading-[1.05] opacity-95 drop-shadow-lg">
              Trabalhe <br />
              <span className="text-primary">Conosco</span>
            </h1>
            <div className="h-1 w-24 bg-primary mb-10"></div>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed drop-shadow">
              Junte-se à equipe da Santa Marta Engenharia. Estamos sempre em busca de talentos para construir o futuro.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-primary text-2xl font-bold mb-8 flex items-center gap-3 font-display">
                <span className="w-8 h-[1px] bg-primary"></span>
                Nossa Cultura
              </h3>
              <div className="space-y-8">
                <p className="text-slate-300 leading-relaxed text-lg">
                  Na Santa Marta Engenharia, valorizamos a excelência, inovação e a dedicação de nossos profissionais. Buscamos pessoas que queiram fazer a diferença no setor de engenharia e geossintéticos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-background-dark/50 p-6 rounded-xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">school</span>
                    <h4 className="text-white font-bold mb-2">Desenvolvimento</h4>
                    <p className="text-slate-400 text-sm">Incentivamos o crescimento contínuo de nossos colaboradores.</p>
                  </div>
                  <div className="bg-background-dark/50 p-6 rounded-xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">handshake</span>
                    <h4 className="text-white font-bold mb-2">Ambiente Colaborativo</h4>
                    <p className="text-slate-400 text-sm">Trabalhamos em equipe para alcançar os melhores resultados.</p>
                  </div>
                  <div className="bg-background-dark/50 p-6 rounded-xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">emoji_objects</span>
                    <h4 className="text-white font-bold mb-2">Inovação</h4>
                    <p className="text-slate-400 text-sm">Buscamos constantemente novas tecnologias e soluções.</p>
                  </div>
                  <div className="bg-background-dark/50 p-6 rounded-xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">health_and_safety</span>
                    <h4 className="text-white font-bold mb-2">Segurança</h4>
                    <p className="text-slate-400 text-sm">A segurança no trabalho é o nosso valor inegociável.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Image */}
            <div className="rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 h-64 relative border border-primary/20 group">
              <Image
                src="/images/contact-bg.png"
                alt="Equipe Santa Marta Engenharia"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
            </div>
          </div>

          {/* Right Column: Form */}
          <WorkWithUsForm />
        </div>
      </div>
    </div>
  );
}
