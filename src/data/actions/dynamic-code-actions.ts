'use server'

import { getUserMe } from '@/data/services/get-user-me-service'
import {
  createDynamicQRForUser,
  deleteDynamicQRForUser,
  disableDynamicQRForUser,
  enableDynamicQRForUser,
  getActiveQrLimitForUser,
  listDynamicQRsForUser,
  QRQuotaError,
  type QuotaResult,
  updateDynamicQRUrlForUser,
} from '@/data/services/dynamic-qr-core'
import { generateQr } from '@/utils/generate-qr'
import { getWorkerUrl } from '@/utils/get-worker-url'
import { transformTimestamp } from '@/utils/transform-timestamp'

export type { QuotaResult } from '@/data/services/dynamic-qr-core'

async function withUser<T>(action: (uid: string) => Promise<T>, fallback: T) {
  try {
    const user = await getUserMe()
    if (!user) throw new Error('Unauthorized')
    return await action(user.uid)
  } catch (error) {
    console.error(error)
    return fallback
  }
}

async function withQuota<T>(
  action: (uid: string) => Promise<T>,
): Promise<QuotaResult<T>> {
  return withUser<QuotaResult<T>>(
    async (uid) => {
      try {
        return { ok: true, data: await action(uid) }
      } catch (error) {
        if (error instanceof QRQuotaError) {
          return { ok: false, error: error.code, limit: error.limit }
        }
        throw error
      }
    },
    { ok: false, error: 'failed' },
  )
}

export async function createDynamicQR(
  url: string,
): Promise<QuotaResult<string>> {
  return withQuota(async (uid) => (await createDynamicQRForUser(uid, url)).svg)
}

/** null means unlimited (or a failed lookup), as before. */
export async function getActiveQrLimit() {
  return withUser<number | null>(getActiveQrLimitForUser, null)
}

export async function updateUrlDynamicQR(key: string, url: string) {
  return withUser((uid) => updateDynamicQRUrlForUser(uid, key, url), false)
}

export async function listDynamicQRs() {
  return withUser(async (uid) => {
    const qrs = await listDynamicQRsForUser(uid)
    return Promise.all(
      qrs.map(async (item) => {
        const shortUrl = getWorkerUrl(item.alias)
        return {
          ...item,
          createdAt: transformTimestamp(item.createdAt),
          shortUrl,
          svg: await generateQr(shortUrl),
        }
      }),
    )
  }, null)
}

export async function deleteDynamicQR(key: string) {
  return withUser((uid) => deleteDynamicQRForUser(uid, key), false)
}

export async function disableDynamicQR(key: string) {
  return withUser((uid) => disableDynamicQRForUser(uid, key), false)
}

export async function enableDynamicQR(key: string): Promise<QuotaResult<null>> {
  return withQuota((uid) => enableDynamicQRForUser(uid, key))
}
