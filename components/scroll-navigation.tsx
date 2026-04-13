"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function ScrollNavigation() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            // Show "Back to Top" after scrolling 400px
            setScrolled(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname?.startsWith("/dashboard")) return null;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-10 right-6 lg:right-10 z-[100] pointer-events-none">
            <AnimatePresence mode="wait">
                {!scrolled ? (
                    <motion.div
                        key="scroll-down"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center gap-6"
                    >
                        <span
                            className="text-[10px] tracking-[0.6em] uppercase text-primary/60 font-medium vertical-text rotate-180"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            Scroll
                        </span>
                        <div className="relative h-24 w-[1px] bg-primary/10 overflow-hidden">
                            <motion.div
                                animate={{
                                    y: ["-100%", "100%"],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent"
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="back-to-top"
                        initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="pointer-events-auto flex items-center justify-center size-12 lg:size-14 rounded-full border border-primary/30 bg-background-dark/80 backdrop-blur-md text-primary shadow-2xl hover:border-primary hover:shadow-primary/20 transition-all group"
                    >
                        <span className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform">
                            expand_less
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
