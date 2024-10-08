'use server'

import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export default async function Home() {
  return (
    <main className="w-full max-w-3xl min-h-screen mx-auto">
      {/* @ts-ignore */}
      <Header />
      <Hero />
    </main>
  );
}
