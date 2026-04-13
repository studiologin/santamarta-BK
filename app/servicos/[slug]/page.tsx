import { services } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services.find(s => s.slug === slug)

  if (!service) {
    console.error(`Service not found for slug: ${slug}`)
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f6] dark:bg-[#0A192A]">
      {/* Hero Header */}
      <div className="relative h-[40vh] bg-[#0d2035] flex items-end border-b border-[#CCA672]/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2035] via-[#0d2035]/50 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-10 pb-12">
          <Link href="/servicos" className="inline-flex items-center gap-2 text-[#CCA672] text-xs font-bold uppercase tracking-widest hover:text-white mb-6 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar para Serviços
          </Link>
          <h1 className="text-5xl lg:text-7xl font-bold font-fahkwang text-white uppercase tracking-tight">{service.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content */}
          <div>
            <div className="prose prose-lg max-w-none prose-invert">
              <p className="text-2xl font-light text-slate-300 mb-8 leading-relaxed border-l-4 border-[#CCA672] pl-6">
                {service.description}
              </p>
              <div className="text-slate-400 leading-relaxed space-y-6">
                <p>{service.fullDescription}</p>
              </div>

              <h3 className="text-2xl font-bold text-white mt-12 mb-6 font-fahkwang uppercase tracking-tight">Benefícios Exclusivos</h3>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-center gap-4 bg-[#0d2035] p-4 rounded-xl border border-[#CCA672]/5">
                  <div className="w-10 h-10 rounded-full bg-[#CCA672]/10 flex items-center justify-center text-[#CCA672] shrink-0">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <span className="text-slate-300 font-medium">Execução conforme normas técnicas rigorosas</span>
                </li>
                <li className="flex items-center gap-4 bg-[#0d2035] p-4 rounded-xl border border-[#CCA672]/5">
                  <div className="w-10 h-10 rounded-full bg-[#CCA672]/10 flex items-center justify-center text-[#CCA672] shrink-0">
                    <span className="material-symbols-outlined">engineering</span>
                  </div>
                  <span className="text-slate-300 font-medium">Equipe especializada e certificada</span>
                </li>
                <li className="flex items-center gap-4 bg-[#0d2035] p-4 rounded-xl border border-[#CCA672]/5">
                  <div className="w-10 h-10 rounded-full bg-[#CCA672]/10 flex items-center justify-center text-[#CCA672] shrink-0">
                    <span className="material-symbols-outlined">shield</span>
                  </div>
                  <span className="text-slate-300 font-medium">Garantia de qualidade e segurança operacional</span>
                </li>
              </ul>
            </div>
            <div className="mt-12">
              <Link href="/contato" className="inline-flex items-center gap-3 bg-[#CCA672] text-[#0A192A] px-10 py-5 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-all font-fahkwang text-lg shadow-[0_0_30px_rgba(204,166,114,0.2)]">
                Solicitar Orçamento
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl border border-[#CCA672]/10 group">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192A] via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 p-10">
              <div className="w-20 h-20 bg-[#CCA672] rounded-full flex items-center justify-center text-[#0A192A] mb-6 shadow-lg">
                <span className="material-symbols-outlined text-4xl">
                  {service.slug === 'construcao-civil' ? 'apartment' :
                    service.slug === 'geossinteticos' ? 'layers' : 'engineering'}
                </span>
              </div>
              <p className="text-white/80 text-sm uppercase tracking-widest font-bold">Excelência Santa Marta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
