import Link from "next/link";
import { AudioLines } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <AudioLines className="text-primary-foreground size-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Sonix
            </span>
          </Link>

          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Sonix. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Özellikler
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Nasıl Çalışır?
            </Link>
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
