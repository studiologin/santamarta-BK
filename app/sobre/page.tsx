import Link from "next/link";
import Image from "next/image";
import BrazilMap from "@/components/brazil-map";
import { createClient } from "@/utils/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('pages').select('content').eq('slug', 'sobre').single();
  const content = data?.content || {};

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image
            alt="Industrial refinery facility"
            className="object-cover grayscale brightness-[0.35] contrast-125"
            src="https://picsum.photos/seed/about-hero/1920/1080"
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
            <span className="text-primary">Sobre</span>
          </div>
          <div className="max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight text-white mb-6 uppercase font-industrial leading-[1.05] opacity-95 drop-shadow-lg">
              {content.hero_title ? (
                <span dangerouslySetInnerHTML={{ __html: content.hero_title.replace('Santa Marta', '<span class="text-primary">Santa Marta</span>') }} />
              ) : (
                <>
                  Sobre a <br />
                  <span className="text-primary">Santa Marta</span>
                </>
              )}
            </h1>
            <div className="h-1 w-24 bg-primary mb-10"></div>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl font-light leading-relaxed drop-shadow">
              Quatro décadas de excelência, forjando o futuro da infraestrutura industrial com segurança, precisão técnica e compromisso ambiental.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative Section */}
      < section className="py-24 max-w-7xl mx-auto px-6 lg:px-10" >
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-bold uppercase tracking-tight font-industrial text-white">Um Legado de 40 Anos</h2>
              <p className="text-primary font-semibold mt-1">Sediada em Salvador, Bahia</p>
            </div>

            {content.history_text ? (
              <div
                className="prose prose-invert prose-lg max-w-none prose-p:text-slate-400 prose-p:leading-relaxed prose-a:text-primary prose-headings:text-white prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: content.history_text }}
              />
            ) : (
              <>
                <p className="text-lg text-slate-400 leading-relaxed">Com uma história de excelência consolidada desde 1986, a Santa Marta nasceu com o propósito de transformar o setor industrial através da segurança e inovação técnica de ponta. Nossa trajetória de quase 40 anos é marcada pela busca incessante por soluções que impulsionam o progresso nacional.</p>
                <p className="text-lg text-slate-400 leading-relaxed">Desde nossa fundação, temos sido parceiros estratégicos das maiores indústrias do país. O que começou como uma visão de rigor técnico expandiu-se para um legado de solidez, mantendo a transparência e a ética como pilares fundamentais de cada projeto executado.</p>
              </>
            )}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
              <div>
                <span className="block text-4xl font-black text-primary mb-1">40+</span>
                <span className="text-sm uppercase tracking-widest font-medium text-slate-500">Anos de Experiência</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-primary mb-1">500+</span>
                <span className="text-sm uppercase tracking-widest font-medium text-slate-500">Projetos Entregues</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-xl overflow-hidden border border-primary/20 shadow-2xl relative">
              <Image
                alt="Industrial complex at night"
                className="object-cover"
                src="https://picsum.photos/seed/industrial-complex/800/800"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary p-10 rounded-xl hidden lg:block z-10">
              <span className="material-symbols-outlined text-background-dark text-5xl">verified_user</span>
            </div>
          </div>
        </div>
      </section >

      {/* Mission/Vision/Values */}
      < section className="py-24 bg-[#0A192A]" >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase mb-4 font-industrial">Princípios</h2>
          <h3 className="text-4xl font-bold font-industrial text-white">A Força dos Nossos Valores</h3>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-8">
          {/* Missão */}
          <div className="group p-10 bg-background-dark border border-primary/10 rounded-xl hover:border-primary transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-background-dark text-4xl">target</span>
            </div>
            <h4 className="text-2xl font-bold mb-4 font-industrial text-white">Missão</h4>
            <p className="text-slate-400 leading-relaxed">
              Prover soluções de engenharia industrial de alta complexidade com máxima segurança, garantindo a eficiência operacional de nossos clientes.
            </p>
          </div>
          {/* Visão */}
          <div className="group p-10 bg-background-dark border border-primary/10 rounded-xl hover:border-primary transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-background-dark text-4xl">visibility</span>
            </div>
            <h4 className="text-2xl font-bold mb-4 font-industrial text-white">Visão</h4>
            <p className="text-slate-400 leading-relaxed">
              Ser a principal referência técnica em infraestrutura industrial no Norte e Nordeste, reconhecida pela inovação constante e sustentabilidade.
            </p>
          </div>
          {/* Valores */}
          <div className="group p-10 bg-background-dark border border-primary/10 rounded-xl hover:border-primary transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-background-dark text-4xl">handshake</span>
            </div>
            <h4 className="text-2xl font-bold mb-4 font-industrial text-white">Valores</h4>
            <p className="text-slate-400 leading-relaxed">
              Integridade inegociável, segurança em primeiro lugar, respeito ambiental e excelência em cada detalhe do processo.
            </p>
          </div>
        </div>
      </section >

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10 border-t border-primary/10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-video rounded-xl overflow-hidden grayscale brightness-75 border border-primary/20 relative">
              <Image
                alt="Team working"
                className="object-cover"
                src="https://picsum.photos/seed/team-working/800/600"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase font-industrial">Capital Humano</h2>
            <h3 className="text-4xl font-bold font-industrial text-white">Nossa Cultura & Código de Ética</h3>
            <p className="text-lg text-slate-400 leading-relaxed">
              Nossa cultura é pautada pelo compromisso com a vida e o desenvolvimento contínuo. Acreditamos que a engenharia de alta performance só é possível com pessoas apaixonadas por precisão e segurança.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Segurança Inegociável em todas as etapas.
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Inovação orientada para resultados práticos.
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Desenvolvimento humano e profissional constante.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Geographic Presence */}
      <section className="py-24 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-industrial uppercase tracking-tight text-white">Diferenciais Competitivos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-primary/30 text-primary mb-2">
                <span className="material-symbols-outlined text-4xl">engineering</span>
              </div>
              <h4 className="text-xl font-bold font-industrial text-white">Expertise Técnica</h4>
              <p className="text-slate-400">Corpo de engenharia especializado em soluções de alta complexidade e infraestrutura crítica.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-primary/30 text-primary mb-2">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <h4 className="text-xl font-bold font-industrial text-white">Qualidade Certificada</h4>
              <p className="text-slate-400">Processos rigorosos que atendem às normas internacionais de segurança e sustentabilidade ambiental.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-primary/30 text-primary mb-2">
                <span className="material-symbols-outlined text-4xl">business</span>
              </div>
              <h4 className="text-xl font-bold font-industrial text-white">Foco Total B2B</h4>
              <p className="text-slate-400">Atendimento personalizado para grandes indústrias, garantindo pontualidade e excelência operacional.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="bg-primary/5 rounded-2xl p-8 lg:p-16 border border-primary/10 overflow-hidden relative">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 font-industrial text-white">Presença Estratégica</h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                Com matriz em Salvador e filial em Recife, nossa atuação se expande por todo o Nordeste, garantindo uma cobertura ágil e eficiente para os principais polos industriais da região.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold font-industrial text-white">Matriz Salvador</h5>
                    <p className="text-slate-500">Coração de nossas operações administrativas e logística técnica.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold font-industrial text-white">Filial Recife</h5>
                    <p className="text-slate-500">Hub estratégico para atendimento aos polos industriais de Pernambuco.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden relative border border-primary/20 bg-background-light/5 flex items-center justify-center min-h-[400px] lg:min-h-[480px]">
              <BrazilMap />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900/30">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <h2 className="text-3xl font-bold font-industrial text-center mb-12 text-white">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {(() => {
              const defaultFaq = [
                { question: "Quais setores a Santa Marta atende?", answer: "Atendemos os setores de mineração, siderurgia, energia, petroquímica, construção civil, saneamento básico e logística em todo o território nacional." },
                { question: "Como solicitar um orçamento técnico?", answer: "Você pode solicitar um orçamento entrando em contato com nossa equipe pela página de \"Contato\", via WhatsApp, ou enviando um e-mail com as plantas e necessidades preliminares do seu projeto técnico." },
                { question: "A empresa possui certificações de qualidade?", answer: "Sim, a Santa Marta atua seguindo os mais rigorosos padrões de qualidade e segurança do trabalho, garantindo documentação, responsabilidade técnica, excelência operacional e conformidade nas normas de gestão ambiental." },
                { question: "Até onde se estende a área de atuação da empresa?", answer: "Contamos com estrutura de atuação consolidada e expertise para operar em todo o Brasil. Estrategicamente, posicionamos nossa matriz em Salvador (BA) e a filial em Recife (PE), atendendo todos os estados do País e de polos industriais complexos com robusta capacidade logística." }
              ];
              const faqs = content.faq && content.faq.length > 0 ? content.faq : defaultFaq;

              return faqs.map((faq: any, index: number) => (
                <details key={index} className="group border border-primary/10 rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden bg-background-dark/30">
                  <summary className="w-full flex justify-between items-center p-6 text-left hover:bg-primary/5 transition-colors text-white cursor-pointer select-none">
                    <span className="font-bold font-industrial text-lg">{faq.question}</span>
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="p-6 pt-0 text-slate-400 border-t border-primary/5 leading-relaxed bg-primary/5 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </details>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="bg-primary p-10 md:p-16 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(204,166,114,0.15)]">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold text-background-dark mb-4 font-display">{content.cta?.title || "Pronto para elevar o nível de segurança da sua planta?"}</h3>
            <p className="text-background-dark/80 text-lg">{content.cta?.text || "Nossos especialistas estão à disposição para realizar um diagnóstico inicial sem compromisso."}</p>
          </div>
          <Link href={content.cta?.buttonLink || "/contato"}>
            <button className="bg-background-dark text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-background-dark/90 transition-all shadow-xl font-display uppercase tracking-wide">
              {content.cta?.buttonText || "Agendar Consultoria"}
            </button>
          </Link>
        </div>
      </section>
    </div >
  )
}
