'use server'

import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export default async function Home() {
  return (
    <main className="w-full max-w-3xl min-h-screen mx-auto px-4 lg:px-0">
      {/* @ts-ignore */}
      <Header />
      <Hero />
    </main>
  );
}
