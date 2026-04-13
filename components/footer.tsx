"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LoginModal } from "./login-modal"

export function Footer() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-background-dark border-t border-white/5 py-16 bg-surface-blue">
      <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-3">
        <div className="col-span-1 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Image
              src="https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta.png"
              alt="Santa Marta Engenharia"
              width={180}
              height={48}
              className="w-auto h-12 object-contain"
            />
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Referência em geossintéticos e engenharia industrial desde 1986. Qualidade técnica e compromisso ambiental em cada projeto.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="space-y-6 md:pl-12 flex flex-col items-center md:items-start text-center md:text-left">
          <h5 className="text-white font-bold uppercase tracking-widest text-sm">Institucional</h5>
          <ul className="space-y-3 text-slate-500 text-sm flex flex-col items-center md:items-start">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/sobre" className="hover:text-primary transition-colors">Sobre</Link></li>
            <li><Link href="/servicos" className="hover:text-primary transition-colors">Serviços</Link></li>
            <li><Link href="/construcao-civil" className="hover:text-primary transition-colors">Construção Civil</Link></li>
            <li><Link href="/geossinteticos" className="hover:text-primary transition-colors">Geossintéticos</Link></li>
            <li><Link href="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
            <li>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hover:text-primary transition-colors"
              >
                Área Administrativa
              </button>
            </li>
            <li><Link href="/trabalhe-conosco" className="hover:text-primary transition-colors">Trabalhe Conosco</Link></li>
          </ul>
        </div>
        <div className="col-span-1 space-y-6 md:pl-12 flex flex-col items-center md:items-start text-center md:text-left">
          <h5 className="text-white font-bold uppercase tracking-widest text-sm">Contato & Localização</h5>
          <ul className="space-y-4 text-slate-500 text-sm w-full">
            <li className="flex items-center justify-center md:justify-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm">mail</span>
              <a href="mailto:vendas@santamartageo.com.br" className="hover:text-primary transition-colors">vendas@santamartageo.com.br</a>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm">location_on</span>
              Salvador, BA - Brasil
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm">call</span>
              <a href="tel:+5571987203123" className="hover:text-primary transition-colors">Contato - (071) 98720-3123</a>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm">location_on</span>
              Recife, PE - Brasil
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm">call</span>
              <a href="tel:+5581992578686" className="hover:text-primary transition-colors">Contato - (081) 99257-8686</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 uppercase tracking-widest font-bold text-center md:text-left">
        <p>© 2024 SANTA MARTA ENGENHARIA. TODOS OS DIREITOS RESERVADOS.</p>
        <p>Desenvolvido por <a href="https://studiologin.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Studio Login</a></p>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </footer>
  )
}
