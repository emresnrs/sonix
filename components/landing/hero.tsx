"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, AudioWaveform, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function HeroSection() {
  return (
    <main className="relative overflow-hidden">
      {/* Subtle grid background – light mode only */}
      <div
        className="pointer-events-none absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e7e5e4 1px, transparent 1px),
            linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          maskImage: `radial-gradient(ellipse 80% 55% at 50% 0%, #000 50%, transparent 100%)`,
        }}
      />

      <section>
        <div className="relative pt-32 md:pt-44">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-7xl px-6"
          >
            <div className="text-center">
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <Link
                  href="#"
                  className="bg-muted hover:bg-background group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-sm transition-colors duration-300"
                >
                  <span className="text-foreground text-sm">
                    🎙️ Whisper ile Güçlendirildi
                  </span>
                  <span className="block h-4 w-0.5 bg-border" />
                  <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full transition-colors duration-500">
                    <div className="flex w-12 -translate-x-1/2 transition-transform duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Heading – static */}
              <motion.h1
                variants={itemVariants}
                className="mx-auto mt-8 max-w-4xl text-center text-5xl font-semibold tracking-tight md:text-7xl lg:mt-12 xl:text-[5rem]"
              >
                Ses dosyalarınızı
                <br />
                <span className="text-muted-foreground">metne çevirin</span>
              </motion.h1>

              {/* Sub text */}
              <motion.p
                variants={itemVariants}
                className="text-muted-foreground mx-auto mt-6 max-w-xl text-balance text-lg"
              >
                Gizliliğinizi koruyarak Whisper modelleriyle ses kayıtlarınızı
                hızlı ve doğru biçimde transkribe edin.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Button asChild size="lg" className="cursor-pointer px-8">
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Hemen Başla
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cursor-pointer px-8"
                >
                  <Link href="#how-it-works">
                    <AudioWaveform className="size-4" />
                    Nasıl Çalışır?
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* App screenshot placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 md:mt-20"
          >
            <div className="bg-background ring-border/50 relative overflow-hidden rounded-2xl border p-4 shadow-2xl shadow-zinc-950/10 ring-1 dark:shadow-zinc-950/40">
              {/* Placeholder box */}
              <div className="bg-muted/40 border-border/50 flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed md:min-h-[400px]">
                <div className="bg-muted rounded-xl p-4">
                  <ImagePlus className="text-muted-foreground size-8" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  Uygulama ekran görüntüsü buraya gelecek
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
