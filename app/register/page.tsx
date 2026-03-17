"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AudioLines, Eye, EyeOff, UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/auth-store";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Çok zayıf", color: "bg-red-500" };
  if (score === 2) return { score, label: "Zayıf", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Orta", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Güçlü", color: "bg-emerald-500" };
  return { score, label: "Çok güçlü", color: "bg-emerald-600" };
}

const rules = [
  { label: "En az 6 karakter", test: (p: string) => p.length >= 6 },
  { label: "Bir büyük harf", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Bir rakam", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const result = registerUser(form.fullName, form.username, form.password);

    if (result.ok) {
      router.push("/login?registered=1");
    } else {
      setError(result.error);
      setLoading(false);
    }
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
          href="/login"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Zaten hesabın var mı?
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div
          className="pointer-events-none fixed inset-0 -z-10 dark:hidden"
          style={{
            backgroundImage: `linear-gradient(to right, #e7e5e4 1px, transparent 1px), linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            maskImage: `radial-gradient(ellipse 70% 70% at 50% 30%, #000 40%, transparent 100%)`,
          }}
        />

        <div className="w-full max-w-sm">
          <div className="bg-background rounded-2xl border p-8 shadow-lg shadow-zinc-950/5">
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <div className="bg-primary mb-1 rounded-xl p-3">
                <UserPlus className="text-primary-foreground size-5" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Hesap oluştur
              </h1>
              <p className="text-muted-foreground text-sm">
                Ücretsiz başlayın, kredi kartı gerekmez
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Adınız Soyadınız"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username">Kullanıcı adı</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="kullanici_adi"
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => update("username", e.target.value)}
                  required
                />
                <p className="text-muted-foreground text-xs">En az 3 karakter, küçük harf</p>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
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

                {form.password.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Şifre gücü:{" "}
                      <span className="text-foreground font-medium">
                        {strength.label}
                      </span>
                    </p>
                    <ul className="space-y-1">
                      {rules.map((rule) => {
                        const ok = rule.test(form.password);
                        return (
                          <li key={rule.label} className="flex items-center gap-1.5">
                            {ok ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <X className="text-muted-foreground size-3" />
                            )}
                            <span className={`text-xs ${ok ? "text-foreground" : "text-muted-foreground"}`}>
                              {rule.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Şifreyi onayla</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                    className={`pr-10 ${
                      form.confirm.length > 0
                        ? form.confirm === form.password
                          ? "border-emerald-500 focus-visible:ring-emerald-500/30"
                          : "border-red-400 focus-visible:ring-red-400/30"
                        : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {form.confirm.length > 0 && form.confirm !== form.password && (
                  <p className="text-destructive text-xs">Şifreler eşleşmiyor.</p>
                )}
              </div>

              {error && (
                <p className="text-destructive rounded-md bg-destructive/10 px-3 py-2 text-sm">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="border-primary-foreground size-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Kayıt oluşturuluyor...
                  </span>
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </form>

            <p className="text-muted-foreground mt-5 text-center text-sm">
              Zaten hesabın var mı?{" "}
              <Link
                href="/login"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
