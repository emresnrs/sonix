"use client";

import { useLanguage } from "@/components/language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { locale, setLocale, locales } = useLanguage();
  
  const currentLocale = locales.find((l) => l.code === locale) || locales[1]; // Varsayılan TR

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md relative select-none">
          <span className="text-lg leading-none">{currentLocale.flag}</span>
          <span className="sr-only">Dil Değiştir</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={`cursor-pointer ${locale === l.code ? "bg-accent" : ""}`}
          >
            <span className="mr-2 text-lg leading-none">{l.flag}</span>
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
