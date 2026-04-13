"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface ProductGalleryProps {
    productName: string
    images: string[]
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    // Desabilitar o scroll da página quando o lightbox estiver aberto
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        // Limpeza na desmontagem
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isLightboxOpen])

    const nextImage = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % images.length)
    }, [images.length])

    const prevImage = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
    }, [images.length])

    // Lidar com teclas para navegação c/ teclado
    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return

            if (e.key === "Escape") setIsLightboxOpen(false)
            if (e.key === "ArrowRight") nextImage()
            if (e.key === "ArrowLeft") prevImage()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isLightboxOpen, nextImage, prevImage])


    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-video w-full overflow-hidden bg-[#162a3f] rounded-xl border border-white/5 flex justify-center items-center">
                <span className="material-symbols-outlined text-6xl text-slate-500">image</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Imagem Principal */}
            <div
                className="relative aspect-video w-full overflow-hidden bg-[#162a3f] rounded-xl group border border-white/5 cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image
                    src={images[activeIndex]}
                    alt={productName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-[#07121d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="material-symbols-outlined text-white text-5xl opacity-80 mix-blend-screen scale-50 group-hover:scale-100 transition-transform duration-300">zoom_out_map</span>
                </div>
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-2">
                    {images.map((imgUrl, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`aspect-square rounded-lg overflow-hidden border bg-[#162a3f] cursor-pointer relative group/thumb transition-all duration-300 ${i === activeIndex
                                ? 'border-primary ring-2 ring-primary/20 scale-100 opacity-100'
                                : 'border-white/10 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={imgUrl}
                                alt={`${productName} detalhe ${i + 1}`}
                                fill
                                sizes="20vw"
                                className="object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox / Imagem Expandida */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#07121d]/95 backdrop-blur-xl animate-in fade-in duration-300">

                    {/* Botão Fechar */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 rounded-full transition-colors z-50 border border-white/10"
                        title="Fechar (Esc)"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>

                    {/* Navegação */}
                    {images.length > 1 && (
                        <>
                            {/* Overlay invisível para fechar ao clicar ao redor da foto */}
                            <div className="absolute inset-0 -z-10" onClick={() => setIsLightboxOpen(false)} />

                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-[#0d1b2a]/80 hover:bg-primary text-white hover:text-[#0d1b2a] border border-white/10 hover:border-primary rounded-full transition-all z-50 backdrop-blur"
                                title="Foto Anterior (Setinha p/ Esquerda)"
                            >
                                <span className="material-symbols-outlined text-3xl">chevron_left</span>
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-[#0d1b2a]/80 hover:bg-primary text-white hover:text-[#0d1b2a] border border-white/10 hover:border-primary rounded-full transition-all z-50 backdrop-blur"
                                title="Próxima Foto (Setinha p/ Direita)"
                            >
                                <span className="material-symbols-outlined text-3xl">chevron_right</span>
                            </button>
                        </>
                    )}

                    {/* Wrapper da imagem do Lightbox */}
                    <div className="relative w-full max-w-6xl max-h-[85vh] h-full mx-6 md:mx-32 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-full">
                            <Image
                                src={images[activeIndex]}
                                alt={`${productName} Expandida`}
                                fill
                                className="object-contain drop-shadow-2xl animate-in zoom-in-95 duration-500"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Indicador de fotos */}
                        {images.length > 1 && (
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold uppercase tracking-[0.2em] font-display">
                                <span className="text-white">{activeIndex + 1}</span> / {images.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
