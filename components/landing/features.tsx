"use client";

import { motion, type Variants } from "framer-motion";
import { Zap, ShieldCheck, SlidersHorizontal } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Hızlı Transkripsiyon",
    description:
      "Whisper modelleri sayesinde dakikalar içinde uzun ses dosyalarınızı metne dönüştürün. Saat uzunluğundaki kayıtlar bile hızla işlenir.",
    gradient: "from-amber-500/10 to-orange-500/5",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: SlidersHorizontal,
    title: "Whisper Model Seçimi",
    description:
      "Tiny'den Large'a kadar farklı Whisper modelleri arasından ihtiyacınıza göre seçim yapın. Hız ve doğruluk arasında dengeyi siz kurun.",
    gradient: "from-blue-500/10 to-indigo-500/5",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Gizlilik Öncelikli",
    description:
      "Ses dosyalarınız sunucularımızda saklanmaz. Tüm işlem yerel olarak gerçekleşir, verileriniz her zaman sizin kontrolünüzde kalır.",
    gradient: "from-emerald-500/10 to-green-500/5",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, bounce: 0.3, duration: 1.2 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-3"
          >
            Neden Sonix?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-semibold md:text-5xl"
          >
            Basit, hızlı ve{" "}
            <span className="font-serif italic">güvenilir</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg"
          >
            Profesyoneller, öğrenciler ve içerik üreticileri için
            tasarlandı.
          </motion.p>
        </div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${feature.gradient} bg-card p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-950/5`}
              >
                <div
                  className={`${feature.iconBg} mb-4 inline-flex size-11 items-center justify-center rounded-xl`}
                >
                  <Icon className={`${feature.iconColor} size-5`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
