import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <main className="w-full max-w-3xl min-h-screen mx-auto">
      <Header />
      <Hero />
    </main>
  );
}
