'use server'

import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Bento } from "@/components/landing/bento";

export default async function Home() {
  return (
    <main className="w-full max-w-3xl min-h-screen mx-auto px-4 lg:px-0">
      <Header />
      <Hero />
      <Bento />
      {/* <UseCases /> */}
      {/* <Footer /> */}
    </main>
  );
}
