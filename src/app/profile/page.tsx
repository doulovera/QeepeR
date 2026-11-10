'use server'

import { Text } from '@/i18n/provider'

import { redirect } from 'next/navigation'
import { getUserMe } from '@/data/services/get-user-me-service'
import { ApiKeyManager } from '@/components/api-keys/manager'
import { listApiKeys } from '@/data/actions/api-key-actions'

export default async function Page() {
  const user = await getUserMe()

  if (!user) {
    return redirect('/')
  }

  const apiKeys = await listApiKeys()

  return (
    <main className="min-w-80 w-full flex-1 bg-[#b0f0da] px-4 pb-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-center py-10">
          <Text id="profile" />
        </h1>
        <ApiKeyManager
          initialKeys={apiKeys.ok ? apiKeys.data : null}
          defaultOpen
        />
      </div>
    </main>
  )
}
