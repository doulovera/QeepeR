'use server'

import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Bento } from '@/components/landing/bento'

export default async function Home() {
  return (
    <main className="w-full bg-primary-100 px-4 lg:px-0">
      <div className="max-w-3xl mx-auto">
        <Header />
        <Hero />
        <Bento />
        {/* <UseCases /> */}
        {/* <Footer /> */}
      </div>
    </main>
  )
}
