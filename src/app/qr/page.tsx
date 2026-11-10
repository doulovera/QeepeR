'use server'

import { Text } from '@/i18n/provider'

import { redirect } from 'next/navigation'
import { getUserMe } from '@/data/services/get-user-me-service'
import {
  getActiveQrLimit,
  listDynamicQRs,
} from '@/data/actions/dynamic-code-actions'
import { Generate } from '@/components/landing/hero/generate'
import { List } from '@/components/qr-list/list'
import { Header } from '@/components/landing/header'

export default async function Page() {
  const user = await getUserMe()

  if (!user) {
    return redirect('/')
  }

  const [list, activeLimit] = await Promise.all([
    listDynamicQRs(),
    getActiveQrLimit(),
  ])

  if (!list) {
    return (
      <div>
        <Text id="listError" />
      </div>
    )
  }

  return (
    <main className="min-w-80 w-full flex-1 bg-[#b0f0da] px-4 pb-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-center py-10">
          <Text id="qrList" />
        </h1>
        <Generate isUserLogged={!!user?.uid} defaultDynamicSwitch hideable />
        <List list={list} activeLimit={activeLimit} />
      </div>
    </main>
  )
}
