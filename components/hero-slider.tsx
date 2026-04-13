"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "SISTEMA DE PROTEÇÕES",
    description: "Segurança e eficiência para sua obra com nossas soluções em proteção coletiva.",
    image: "https://picsum.photos/seed/construction/1920/1080",
    cta: "Ver Soluções",
    link: "/construcao-civil"
  },
  {
    id: 2,
    title: "GEOSSINTÉTICOS",
    description: "Tecnologia avançada para obras de infraestrutura e meio ambiente.",
    image: "https://picsum.photos/seed/geosynthetics/1920/1080",
    cta: "Conhecer Produtos",
    link: "/geossinteticos"
  },
  {
    id: 3,
    title: "PROJETOS E CONSULTORIA",
    description: "Engenharia especializada para garantir o sucesso do seu empreendimento.",
    image: "https://picsum.photos/seed/engineering/1920/1080",
    cta: "Saiba Mais",
    link: "/servicos"
  }
]

export function HeroSlider() {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto h-full px-4 md:px-6 flex flex-col justify-center text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold max-w-3xl mb-4"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl max-w-2xl mb-8 text-slate-200"
            >
              {slides[current].description}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href={slides[current].link}>
                  {slides[current].cta} <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === current ? "bg-white w-8" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
