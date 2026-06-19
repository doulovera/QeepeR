'use server'

import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Bento } from '@/components/landing/bento'

export default async function Home() {
  return (
    <main className="relative w-full overflow-hidden px-4 py-8 sm:py-14 lg:px-8">
      <div className="pointer-events-none absolute left-10 top-16 hidden h-28 w-36 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:24px_24px] sm:block" />
      <div className="pointer-events-none absolute right-10 top-16 hidden items-center gap-0 lg:flex">
        <span className="h-7 w-14 bg-black" />
        <span className="h-16 w-16 bg-main" />
      </div>
      <div className="pointer-events-none absolute bottom-28 left-0 hidden h-72 w-32 bg-main sm:block" />
      <div className="pointer-events-none absolute bottom-12 right-5 hidden h-44 w-24 border-2 border-black bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:24px_24px] lg:block" />
      <div className="relative mx-auto max-w-7xl">
        <Hero />
        {/* <Bento /> */}
        {/* <UseCases /> */}
        {/* <Footer /> */}
      </div>
    </main>
  )
}
