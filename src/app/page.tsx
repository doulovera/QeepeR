'use server'

import { Hero } from "@/components/landing/hero";

export default async function Home() {
  return (
    <main className="w-full max-w-3xl min-h-screen mx-auto">
      <Hero />
    </main>
  );
}
