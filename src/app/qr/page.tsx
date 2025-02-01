'use server'

import { redirect } from 'next/navigation'
import { getUserMe } from '@/data/services/get-user-me-service'
import { listDynamicQRs } from '@/data/actions/dynamic-code-actions'
import { Generate } from '@/components/landing/hero/generate'
import { List } from '@/components/qr-list/list'
import { Header } from '@/components/landing/header'

export default async function Page() {
  const user = await getUserMe()

  if (!user) {
    return redirect('/')
  }

  const list = await listDynamicQRs()

  if (!list) {
    return <div>Improve this</div>
  }

  return (
    <main className="min-w-80 w-full bg-[#b0f0da] pb-10">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <h1 className="text-4xl font-semibold text-center my-10">
          Your QR List
        </h1>
        <Generate isUserLogged={!!user?.uid} />
        <List list={list} />
      </div>
    </main>
  )
}
