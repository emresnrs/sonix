import { HeroHeader } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroHeader />
      <HeroSection />
    </div>
  );
}

