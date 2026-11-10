import 'server-only'

import { PLANS } from '@/constants/plans'
import { QRs } from '@/data/models/QRs'
import { User } from '@/data/models/Users'
import { generateQr } from '@/utils/generate-qr'
import { getWorkerUrl } from '@/utils/get-worker-url'
import {
  addQR,
  deleteQRInDB,
  getOneQRInDB,
  listUserQrs,
  updateDisableQRInDB,
  updateQRUrlInDB,
} from './qr-db-service'
import {
  createWorkerQR,
  deleteWorkerQR,
  updateUrlWorkerQR,
} from './qr-object-service'
import {
  checkCanCreateQR,
  checkCanEnableQR,
  getPlanLimits,
  type QuotaError,
} from './quota-service'

export type QuotaResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: QuotaError; limit: number }
  | { ok: false; error: 'failed' }

/** Errors whose message is safe to show to API clients. */
export class QRUserError extends Error {}

export class QRQuotaError extends QRUserError {
  constructor(
    public readonly code: QuotaError,
    public readonly limit: number,
  ) {
    super(
      `${code === 'enabled_limit' ? 'Active' : 'Total'} QR quota limit reached (${limit}).`,
    )
  }
}

function validateUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return
  } catch {
    // Use the same error for malformed URLs and unsupported protocols.
  }
  throw new QRUserError('Enter a valid HTTP or HTTPS URL.')
}

/** Never expose or mutate a QR outside the authenticated account. */
export async function getOwnedQR(key: string, uid: string) {
  if (!uid || !key || key.includes('/')) throw new QRUserError('Unauthorized')
  const qr = await getOneQRInDB(key)
  if (!qr || qr.userId !== uid) throw new QRUserError('QR not found or unauthorized')
  return qr
}

export async function createDynamicQRForUser(uid: string, url: string) {
  if (!uid) throw new QRUserError('Unauthorized')
  validateUrl(url)

  // Check before touching the worker so a rejected QR leaves nothing in KV.
  const quota = await checkCanCreateQR(uid)
  if (!quota.ok) throw new QRQuotaError(quota.error, quota.limit)

  const workerQR = await createWorkerQR(url)
  if (!workerQR) throw new QRUserError('Failed to create QR')

  const saved = await addQR(workerQR.key, { url, uid })
  if (!saved) {
    // Remove the link so it cannot work without counting toward the limit.
    await deleteWorkerQR(workerQR.key)
    throw new QRUserError('Failed to save QR')
  }

  return {
    key: workerQR.key,
    shortUrl: workerQR.url,
    destinationUrl: url,
    svg: await generateQr(workerQR.url),
  }
}

export async function getActiveQrLimitForUser(uid: string) {
  const { enabled } = await getPlanLimits(uid)
  return Number.isFinite(enabled) ? enabled : null
}

export async function updateDynamicQRUrlForUser(
  uid: string,
  key: string,
  url: string,
) {
  validateUrl(url)
  const qr = await getOwnedQR(key, uid)

  // Disabled QRs have no worker link, so only Firestore is updated.
  if (!qr.disabled && !(await updateUrlWorkerQR(key, url))) {
    throw new QRUserError('Failed to update QR')
  }
  if (!(await updateQRUrlInDB(key, url))) {
    if (!qr.disabled) await updateUrlWorkerQR(key, qr.destinationUrl)
    throw new QRUserError('Failed to update QR')
  }
  return true
}

export async function listDynamicQRsForUser(uid: string) {
  if (!uid) throw new QRUserError('Unauthorized')
  const response = await listUserQrs(uid)
  if (!response) throw new QRUserError('Failed to list QRs')
  // Check ownership even if a stale user-link index points to another account.
  return response.filter((qr) => qr.userId === uid)
}

export async function deleteDynamicQRForUser(uid: string, key: string) {
  const qr = await getOwnedQR(key, uid)
  const removed = qr.disabled ? 'missing' : await deleteWorkerQR(key)
  if (!removed) throw new QRUserError('Failed to delete QR')

  if (!(await deleteQRInDB(key))) {
    // Only restore a link that existed before.
    if (removed === 'deleted') await createWorkerQR(qr.destinationUrl, { key })
    throw new QRUserError('Failed to delete QR')
  }
  return true
}

export async function disableDynamicQRForUser(uid: string, key: string) {
  const qr = await getOwnedQR(key, uid)
  // Remove the link before freeing the active slot. Missing counts as removed.
  const removed = await deleteWorkerQR(key)
  if (!removed) throw new QRUserError('Failed to disable QR')

  if (!(await updateDisableQRInDB(key, true))) {
    if (removed === 'deleted') await createWorkerQR(qr.destinationUrl, { key })
    throw new QRUserError('Failed to disable QR')
  }
  return true
}

export async function enableDynamicQRForUser(uid: string, key: string) {
  const qr = await getOwnedQR(key, uid)
  // An already enabled QR holds its slot; just make sure the link exists.
  if (qr.disabled) {
    const quota = await checkCanEnableQR(uid)
    if (!quota.ok) throw new QRQuotaError(quota.error, quota.limit)
  }

  // Create the link before taking an active slot.
  if (!(await createWorkerQR(qr.destinationUrl, { key }))) {
    throw new QRUserError('Failed to enable QR')
  }
  if (!(await updateDisableQRInDB(key, false))) {
    if (qr.disabled) await deleteWorkerQR(key)
    throw new QRUserError('Failed to enable QR')
  }
  return null
}

export async function getPlanUsageForUser(uid: string) {
  if (!uid) throw new QRUserError('Unauthorized')
  const [plan, counts] = await Promise.all([
    User.getPlan(uid),
    QRs.countByUser(uid),
  ])
  const limits = PLANS[plan]
  return {
    plan,
    enabled: counts.enabled,
    total: counts.total,
    limits: {
      enabled: Number.isFinite(limits.enabled) ? limits.enabled : null,
      total: Number.isFinite(limits.total) ? limits.total : null,
    },
  }
}

export function qrDetails(qr: Awaited<ReturnType<typeof getOwnedQR>>) {
  return {
    key: qr.alias,
    shortUrl: getWorkerUrl(qr.alias),
    destinationUrl: qr.destinationUrl,
    disabled: qr.disabled,
    createdAt: qr.createdAt.toDate().toISOString(),
  }
}
