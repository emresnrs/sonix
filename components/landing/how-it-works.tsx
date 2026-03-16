"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileText } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Ses Dosyasını Yükle",
    description:
      "MP3, WAV, M4A veya diğer ses formatlarındaki dosyanızı sürükle bırak yöntemiyle ya da dosya seçici ile yükleyin.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Whisper Modelini Seç",
    description:
      "Tiny'den Large'a kadar farklı Whisper modellerinden birini seçin. İhtiyacınıza göre hız veya doğruluğu önceliklendirin.",
  },
  {
    step: "03",
    icon: FileText,
    title: "Transkripti İndir",
    description:
      "Yapay zeka işlemi tamamlandığında tam metni ve zaman damgalarını görün. TXT veya SRT formatında dışa aktarın.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      {/* Subtle separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-3"
          >
            Nasıl Çalışır?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-semibold md:text-5xl"
          >
            Üç adımda{" "}
            <span className="font-serif italic">hazır</span>
          </motion.h2>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="pointer-events-none absolute left-0 top-14 hidden w-full items-center md:flex">
            <div className="mx-auto w-2/3 border-t border-dashed border-border" />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring",
                  bounce: 0.3,
                  duration: 1.2,
                  delay: index * 0.15,
                }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="bg-background border-2 border-border relative z-10 mb-6 inline-flex size-16 items-center justify-center rounded-2xl shadow-sm">
                  <Icon className="size-7 text-foreground" />
                  <span className="bg-primary text-primary-foreground absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
