'use server'

import {
  ApiKeyError,
  createApiKeyForUser,
  listApiKeysForUser,
  revokeApiKeyForUser,
} from '@/data/services/api-key-service'
import { getUserMe } from '@/data/services/get-user-me-service'

async function withUser<T>(action: (uid: string) => Promise<T>) {
  const user = await getUserMe()
  if (!user) return { ok: false, error: 'unauthorized' } as const
  try {
    return { ok: true, data: await action(user.uid) } as const
  } catch (error) {
    return {
      ok: false,
      error: error instanceof ApiKeyError ? error.code : 'failed',
    } as const
  }
}

export async function createApiKey(name: string) {
  return withUser((uid) => createApiKeyForUser(uid, name))
}

export async function listApiKeys() {
  return withUser(listApiKeysForUser)
}

export async function revokeApiKey(id: string) {
  return withUser((uid) => revokeApiKeyForUser(uid, id))
}
