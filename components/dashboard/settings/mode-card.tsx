"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";

export function ModeCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleThemeChange(t: string) {
    setTheme(t);
  }

  const gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance")}</CardTitle>
          <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className={gridClasses}>
          <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.appearance")}</CardTitle>
        <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
      </CardHeader>
      <CardContent className={gridClasses}>
        {/* Light */}
        <div className="flex flex-col gap-3 cursor-pointer" onClick={() => handleThemeChange("light")}>
          <div className="relative">
            <div className="aspect-video rounded-lg border-2 border-border dark:border-muted-foreground bg-background dark:bg-foreground overflow-hidden transition-colors">
              <div className="h-5 border-b border-border dark:border-muted-foreground bg-muted dark:bg-muted-foreground/30"></div>
              <div className="p-2 space-y-1 mt-2">
                <div className="h-2 bg-muted-foreground/20 rounded dark:bg-muted/30 w-3/4"></div>
                <div className="h-2 bg-muted-foreground/20 rounded dark:bg-muted/30 w-1/2"></div>
                <div className="h-2 bg-muted-foreground/20 rounded dark:bg-muted/30 w-2/3"></div>
              </div>
            </div>
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center transition-colors">
              {theme === "light" && <div className="w-2 h-2 rounded-full bg-primary"></div>}
            </div>
            <Label className="font-medium cursor-pointer">{t("settings.light")}</Label>
          </div>
        </div>

        {/* Dark */}
        <div className="flex flex-col gap-3 cursor-pointer" onClick={() => handleThemeChange("dark")}>
          <div className="relative">
            <div className="aspect-video rounded-lg border-2 border-muted-foreground dark:border-border bg-foreground dark:bg-background overflow-hidden transition-colors">
              <div className="h-5 border-b dark:border-border border-muted-foreground bg-muted-foreground/30 dark:bg-muted"></div>
              <div className="p-2 space-y-1 mt-2">
                <div className="h-2 bg-muted/30 dark:bg-muted-foreground/20 rounded w-3/4"></div>
                <div className="h-2 bg-muted/30 dark:bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-2 bg-muted/30 dark:bg-muted-foreground/20 rounded w-2/3"></div>
              </div>
            </div>
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center transition-colors">
              {theme === "dark" && <div className="w-2 h-2 rounded-full bg-primary"></div>}
            </div>
            <Label className="font-medium cursor-pointer">{t("settings.dark")}</Label>
          </div>
        </div>

        {/* System */}
        <div className="flex flex-col gap-3 cursor-pointer" onClick={() => handleThemeChange("system")}>
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden relative transition-colors">
              <div className="absolute inset-0 w-1/2 rounded-tl-lg rounded-bl-lg border-2 border-r border-border dark:border-muted-foreground bg-background dark:bg-foreground" />
              <div className="absolute inset-0 left-1/2 w-1/2 rounded-tr-lg rounded-br-lg border-2 border-l border-muted-foreground dark:border-border bg-foreground dark:bg-background" />

              <div className="relative">
                <div className="h-5 flex">
                  <div className="w-1/2 rounded-tl-lg border-2 border-r border-border dark:border-muted-foreground bg-muted dark:bg-muted/30"></div>
                  <div className="w-1/2 rounded-tr-lg border-2 border-l border-muted-foreground dark:border-border bg-muted/30 dark:bg-muted"></div>
                </div>
                <div className="p-2 space-y-1 mt-2">
                  <div className="h-2 flex rounded-full">
                    <div className="w-1/2 rounded-tl-md rounded-bl-md bg-muted-foreground/20 dark:bg-muted/30"></div>
                    <div className="w-1/4 rounded-tr-md rounded-br-md bg-muted/30 dark:bg-muted-foreground/20"></div>
                  </div>
                  <div className="h-2 flex rounded-full">
                    <div className="w-1/2 rounded-md bg-muted-foreground/20 dark:bg-muted/30"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center transition-colors">
              {theme === "system" && <div className="w-2 h-2 rounded-full bg-primary"></div>}
            </div>
            <Label className="font-medium cursor-pointer">{t("settings.system")}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
