'use server'

import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Bento } from '@/components/landing/bento'

export default async function Home() {
  return (
    <main className="w-full bg-primary-100 px-4 pb-10 lg:px-0">
      <Header />
      <div className="max-w-4xl mx-auto">
        <Hero />
        <Bento />
        {/* <UseCases /> */}
        {/* <Footer /> */}
      </div>
    </main>
  )
}
