"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale, LOCALES, dictionaries } from "@/locales";

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (keyPath: string) => string;
  locales: typeof LOCALES;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sonix-lang") as Locale;
    if (saved && LOCALES.find((l) => l.code === saved)) {
      setLocaleState(saved);
    } else {
      // Çoğunlukla Türkçe kullanılan bir sistem olduğu için varsayılanı TR tutuyoruz
      setLocaleState("tr");
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("sonix-lang", l);
  };

  const t = (keyPath: string) => {
    // keyPath ör: "sidebar.home"
    const keys = keyPath.split(".");
    let result: any = dictionaries[locale];

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        return keyPath; // Bulunamazsa path'in kendisini dön
      }
    }

    return result as string;
  };

  // SSR uyumsuzluklarını önlemek için hidrasyon bitene kadar gizlemiyoruz,
  // ancak dil henüz yüklenmediyse default TR diliyle dönüyoruz.
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, locales: LOCALES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
