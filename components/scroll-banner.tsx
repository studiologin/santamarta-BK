"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ScrollBanner() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadedFrames, setLoadedFrames] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const frameCount = 30;
    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        // Pre-carrega imagens silenciosamente
        let loaded = 0;
        const images: HTMLImageElement[] = [];

        for (let i = 0; i < frameCount; i++) {
            const img = new window.Image();
            const frameIndex = i.toString().padStart(3, '0');
            img.src = `/images/animacao/Flow_delpmaspu__${frameIndex}.jpg`;

            img.onload = () => {
                loaded++;
                setLoadedFrames(loaded);
                if (loaded === frameCount) {
                    setIsReady(true);
                }
            };
            img.onerror = () => {
                loaded++; // Falha elegante
                setLoadedFrames(loaded);
                if (loaded === frameCount) {
                    setIsReady(true);
                }
            };
            images.push(img);
        }
        imagesRef.current = images;
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const firstImg = imagesRef.current[0];
        if (firstImg && firstImg.complete && firstImg.naturalWidth) {
            canvas.width = firstImg.naturalWidth;
            canvas.height = firstImg.naturalHeight;
            ctx.drawImage(firstImg, 0, 0);
        }

        let animationFrameId: number;

        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            // A animação agora toca enquanto o banner naturalmente sobe na tela
            const scrollDistance = rect.height;
            const scrollTop = -rect.top;

            let scrollFraction = scrollTop / scrollDistance;
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));
            // Fade hint out if user started scrolling
            if (scrollTop > 50 && !hasScrolled) {
                setHasScrolled(true);
            } else if (scrollTop <= 50 && hasScrolled) {
                setHasScrolled(false);
            }

            const frameIndex = Math.min(
                frameCount - 1,
                Math.ceil(scrollFraction * frameCount)
            );

            animationFrameId = requestAnimationFrame(() => {
                const img = imagesRef.current[frameIndex];
                if (img && img.complete) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                }
            });
        };

        // Configura o evento no window pois o componente principal estara no body
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isReady, hasScrolled]);

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-background-dark overflow-clip">
            {/* Wrapper normal (não mais sticky) para a rolagem fluir naturalmente */}
            <div className="relative h-full w-full flex flex-col justify-center text-left overflow-hidden">

                {/* Canvas Background */}
                <div className="absolute inset-0 z-0">
                    <canvas
                        ref={canvasRef}
                        className={cn(
                            "w-full h-full object-cover transition-opacity duration-1000",
                            isReady ? "opacity-100" : "opacity-0"
                        )}
                    />
                    <div className="absolute inset-0 hero-overlay"></div>
                    <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* Loading Overlay */}
                {!isReady && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background-dark text-white">
                        <div className="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
                        <div className="font-mono text-sm tracking-widest text-slate-300">
                            CARREGANDO {loadedFrames} / {frameCount}
                        </div>
                    </div>
                )}

                {/* Hero Content */}
                <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start w-full pointer-events-none">
                    <div className="max-w-4xl space-y-4 md:space-y-6 flex flex-col items-start w-full pointer-events-auto pt-16 md:pt-24 lg:pt-28">
                        <div className="flex items-center justify-start gap-4 mb-2 md:mb-0">
                            <div className="h-[2px] w-12 bg-primary"></div>
                            <span className="text-primary font-bold tracking-[0.4em] text-xs md:text-sm uppercase">Desde 1986</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[5.5rem] font-bold tracking-tight text-white mb-4 md:mb-6 uppercase font-industrial leading-[1.1] opacity-90 text-left">
                            Sistemas de <br />
                            <span className="text-primary inline-block">Proteção</span>
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-xl font-light leading-relaxed italic">
                            Referência absoluta em geossintéticos e engenharia de alta performance para os projetos de infraestrutura mais complexos do país.
                        </p>
                        <div className="pt-4 md:pt-6 lg:pt-8 flex flex-wrap justify-start gap-3 md:gap-4">
                            <Link
                                href="/servicos"
                                className="bg-primary text-background-dark px-8 py-3 md:px-10 md:py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(204,166,114,0.3)] transition-all duration-300 pointer-events-auto"
                            >
                                Nossos Serviços
                            </Link>
                            <Link
                                href="/sobre"
                                className="border border-white/30 text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-background-dark transition-all duration-300 pointer-events-auto"
                            >
                                Conheça a Empresa
                            </Link>
                        </div>
                    </div>
                </div>



            </div>
        </section>
    );
}
