"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

function formatSegment(segment: string): string {
  const map: Record<string, string> = {
    dashboard: "Ana Sayfa",
    transcribe: "Transkribe Et",
    recordings: "Kayıtlar",
    settings: "Ayarlar",
  };
  return map[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

import { useTheme } from "next-themes";

function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors overflow-hidden"
      title="Tema değiştir"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Tema Değiştir</span>
    </button>
  );
}

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export function AppHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((s) => Boolean(s));
  const isHome = pathname === "/dashboard";
  const { t } = useLanguage();

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <div className="mx-2 h-4 w-px bg-border" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm">
          {isHome ? (
            <span className="font-medium">{t("sidebar.home")}</span>
          ) : (
            segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;
              const label = t(`sidebar.${segment}`) === `sidebar.${segment}` ? segment.charAt(0).toUpperCase() + segment.slice(1) : t(`sidebar.${segment}`);
              return (
                <Fragment key={href}>
                  {index > 0 && <span className="text-muted-foreground">/</span>}
                  {isLast ? (
                    <span className="font-medium">{label}</span>
                  ) : (
                    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  )}
                </Fragment>
              );
            })
          )}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

