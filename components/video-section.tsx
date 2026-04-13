"use client";

import React, { useState } from "react";
import Image from "next/image";

interface VideoModalProps {
    videoId: string;
}

export function VideoSection({ videoId }: VideoModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <section className="bg-background-dark py-32 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
                    <div className="space-y-4">
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Institucional</span>
                        <div className="w-24 h-[1px] bg-primary mx-auto mb-6"></div>
                        <h3 className="text-4xl font-black text-white uppercase font-industrial">Conheça a Santa Marta</h3>
                    </div>
                    <div
                        className="relative group cursor-pointer aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000">
                            <Image
                                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                alt="Video Thumbnail"
                                fill
                                sizes="(max-width: 1024px) 100vw, 80vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors z-10">
                                <div className="w-24 h-24 bg-primary/90 rounded-full flex items-center justify-center text-background-dark group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(204,166,114,0.4)]">
                                    <span className="material-symbols-outlined text-5xl fill-current ml-2">play_arrow</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10">
                    <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        <button
                            className="absolute -top-12 right-0 md:top-4 md:right-4 z-50 text-white hover:text-primary transition-colors bg-black/50 rounded-full p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
}
