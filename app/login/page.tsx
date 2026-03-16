"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AudioLines, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Demo account
const DEMO_USERS = [{ username: "admin", password: "admin" }];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const user = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      router.push("/dashboard");
    } else {
      setError("Kullanıcı adı veya şifre hatalı.");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <AudioLines className="text-primary-foreground size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">Sonix</span>
        </Link>
        <Link
          href="/register"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Hesap oluştur
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {/* Subtle grid bg */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 dark:hidden"
          style={{
            backgroundImage: `linear-gradient(to right, #e7e5e4 1px, transparent 1px), linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            maskImage: `radial-gradient(ellipse 70% 70% at 50% 30%, #000 40%, transparent 100%)`,
          }}
        />

        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-background rounded-2xl border p-8 shadow-lg shadow-zinc-950/5">
            {/* Icon */}
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <div className="bg-primary mb-1 rounded-xl p-3">
                <LogIn className="text-primary-foreground size-5" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Tekrar hoş geldiniz
              </h1>
              <p className="text-muted-foreground text-sm">
                Hesabınıza giriş yapın
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username">Kullanıcı adı</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-destructive rounded-md bg-destructive/10 px-3 py-2 text-sm">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="border-primary-foreground size-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Giriş yapılıyor...
                  </span>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>

            {/* Demo note */}
            <div className="bg-muted/60 mt-5 rounded-lg px-4 py-3">
              <p className="text-muted-foreground text-center text-xs">
                Demo hesap:{" "}
                <span className="text-foreground font-medium">admin</span> /{" "}
                <span className="text-foreground font-medium">admin</span>
              </p>
            </div>

            <p className="text-muted-foreground mt-5 text-center text-sm">
              Hesabın yok mu?{" "}
              <Link
                href="/register"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                Kayıt ol
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
