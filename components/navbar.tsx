"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { LoginModal } from "./login-modal"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Hydration fix
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  // Hide Navbar on Dashboard routes
  if (pathname?.startsWith("/dashboard")) return null
  if (!mounted) return <div className="h-20" /> // Placeholder to prevent jump

  return (
    <header className="fixed w-full z-50 bg-background-dark/80 backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Logo_Santa_Marta.png"
            alt="Santa Marta Engenharia"
            width={180}
            height={48}
            className="w-auto h-12 object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
          <Link href="/" className={cn("text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary", pathname === "/" ? "text-primary" : "text-slate-300")}>Home</Link>
          <Link href="/sobre" className={cn("text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary", pathname === "/sobre" ? "text-primary" : "text-slate-300")}>Sobre</Link>
          <Link href="/servicos" className={cn("text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary", pathname.startsWith("/servicos") && pathname !== "/construcao-civil" && !pathname?.startsWith("/geossinteticos") ? "text-primary" : "text-slate-300")}>Serviços</Link>

          {/* Dropdown Soluções */}
          <div className="relative group py-6 -my-6 flex items-center">
            <button className={cn("text-xs flex flex-row items-center gap-1 font-bold uppercase tracking-widest transition-colors hover:text-primary", (pathname === "/construcao-civil" || pathname?.startsWith("/geossinteticos")) ? "text-primary" : "text-slate-300")}>
              Soluções <span className="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
            </button>
            <div className="absolute top-[calc(100%-1.5rem)] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-background-dark/95 backdrop-blur-md border border-primary/20 rounded-xl overflow-hidden min-w-[240px] shadow-2xl flex flex-col">
                <Link href="/construcao-civil" className={cn("px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/5", pathname === "/construcao-civil" ? "text-primary" : "text-slate-300")}>Construção Civil</Link>
                <div className="h-[1px] w-full bg-white/5" />
                <Link href="/geossinteticos" className={cn("px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/5", pathname?.startsWith("/geossinteticos") ? "text-primary" : "text-slate-300")}>Geossintéticos</Link>
              </div>
            </div>
          </div>

          <Link href="/contato" className={cn("text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary", pathname === "/contato" ? "text-primary" : "text-slate-300")}>Contato</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={`https://wa.me/5571987203123?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre as soluções da Santa Marta.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative hidden md:flex items-center gap-2 px-6 py-2.5 bg-transparent border border-white/10 rounded-md text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden group hover:border-[#25D366]/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
            <span className="material-symbols-outlined text-base text-[#25D366] group-hover:scale-110 transition-transform duration-300 z-10">chat</span>
            <span className="z-10">WhatsApp</span>
          </Link>
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-3xl">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-20 h-[calc(100vh-5rem)] bg-[#07121d] overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full px-6 py-8 pb-32">
          <nav className="flex flex-col space-y-6">
            {[
              { name: "Home", href: "/", icon: "home" },
              { name: "Sobre", href: "/sobre", icon: "info" },
              { name: "Serviços", href: "/servicos", icon: "engineering" },
              { type: "label", name: "Soluções", icon: "widgets" },
              { name: "Construção Civil", href: "/construcao-civil", icon: "architecture", isSub: true },
              { name: "Geossintéticos", href: "/geossinteticos", icon: "layers", isSub: true },
              { name: "Contato", href: "/contato", icon: "mail" },
            ].map((item, i) => {
              if (item.isSub && !isSolutionsOpen) return null;

              if (item.type === "label") {
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                    className="flex w-full items-center justify-between py-3 mt-2 text-base font-black uppercase tracking-widest text-slate-300 font-industrial transition-all duration-300 hover:text-white"
                    style={{ transitionDelay: `${isOpen ? i * 75 + 100 : 0}ms`, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateX(0)' : 'translateX(-20px)' }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[24px] opacity-40">{item.icon}</span>
                      {item.name}
                    </div>
                    <span className={cn("material-symbols-outlined text-[20px] opacity-40 transition-transform duration-300", isSolutionsOpen ? "rotate-180" : "")}>expand_more</span>
                  </button>
                );
              }

              const isActive = pathname === item.href || (item.href === "/servicos" && pathname.startsWith("/servicos") && pathname !== "/construcao-civil" && !pathname?.startsWith("/geossinteticos"));

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={cn(
                    "group flex items-center gap-4 py-3 font-black uppercase tracking-widest font-industrial transition-all duration-300",
                    isActive ? "text-primary" : "text-slate-300 hover:text-white",
                    item.isSub ? "pl-10 text-sm opacity-90" : "text-base"
                  )}
                  onClick={() => setIsOpen(false)}
                  style={{
                    transitionDelay: `${isOpen ? i * 75 + 100 : 0}ms`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? (isActive ? 'translateX(10px)' : 'translateX(0)') : 'translateX(-20px)'
                  }}
                >
                  <span className={cn(
                    "material-symbols-outlined transition-opacity",
                    item.isSub ? "text-[20px] opacity-40 group-hover:opacity-100" : "text-[24px] opacity-40 group-hover:opacity-100",
                    isActive ? "text-primary opacity-100" : ""
                  )}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setIsOpen(false);
                setIsLoginOpen(true);
              }}
              className="group flex items-center gap-4 py-3 text-lg font-black uppercase tracking-widest font-industrial transition-all duration-300 text-slate-300 hover:text-white"
              style={{
                transitionDelay: `${isOpen ? 6 * 75 + 100 : 0}ms`,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
              }}
            >
              <span className="material-symbols-outlined text-[28px] opacity-40 group-hover:opacity-100 transition-opacity">admin_panel_settings</span>
              Área Administrativa
            </button>
          </nav>

          <div
            className="mt-auto pt-8 border-t border-slate-800 transition-all duration-700 delay-300"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <Link
              href={`https://wa.me/5571987203123?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre as soluções da Santa Marta.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full overflow-hidden bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-white px-6 py-4 rounded-xl font-bold text-[13px] uppercase tracking-[0.15em] flex items-center justify-between transition-all duration-300 group shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_30px_rgba(37,211,102,0.2)]"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-3xl text-[#25D366] group-hover:scale-110 transition-transform duration-300">chat</span>
                <span className="text-[#25D366] mt-0.5">WhatsApp</span>
              </div>
              <span className="material-symbols-outlined text-[#25D366] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  )
}
