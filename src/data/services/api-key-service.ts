import 'server-only'

import { createHash, randomBytes } from 'node:crypto'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { API_KEY_COLLECTION, USER_COLLECTION } from '@/constants/collections'
import type { ClientApiKey, IApiKey } from '@/data/models/IApiKey'
import { _db } from '@/lib/firebase/admin'

export const MAX_ACTIVE_API_KEYS = 10
const LAST_USED_INTERVAL_MS = 60_000
const KEY_PATTERN = /^qk_live_[A-Za-z0-9_-]{43,128}$/

export class ApiKeyError extends Error {
  constructor(
    public readonly code: 'invalid_name' | 'key_limit' | 'not_found',
  ) {
    super(code)
  }
}

const collection = () => _db.collection(API_KEY_COLLECTION)
const hashKey = (key: string) => createHash('sha256').update(key).digest('hex')

function toClient(id: string, data: IApiKey): ClientApiKey {
  return {
    id,
    name: data.name,
    prefix: data.prefix,
    createdAt: data.createdAt.toDate().toISOString(),
    lastUsedAt: data.lastUsedAt?.toDate().toISOString() ?? null,
    revokedAt: data.revokedAt?.toDate().toISOString() ?? null,
  }
}

export async function createApiKeyForUser(uid: string, name: string) {
  if (!uid) throw new Error('Unauthorized')
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
    throw new ApiKeyError('invalid_name')
  }

  const key = `qk_live_${randomBytes(32).toString('base64url')}`
  const hash = hashKey(key)
  const data: IApiKey = {
    uid,
    name: name.trim(),
    hash,
    prefix: key.slice(0, 16),
    createdAt: Timestamp.now(),
    lastUsedAt: null,
    revokedAt: null,
  }

  await _db.runTransaction(async (transaction) => {
    // The user doc serializes concurrent creates even when the query is empty.
    const userRef = _db.collection(USER_COLLECTION).doc(uid)
    await transaction.get(userRef)
    const keys = await transaction.get(collection().where('uid', '==', uid))
    const activeCount = keys.docs.filter((doc) => !doc.data().revokedAt).length
    if (activeCount >= MAX_ACTIVE_API_KEYS) throw new ApiKeyError('key_limit')

    transaction.set(
      userRef,
      { apiKeysVersion: FieldValue.increment(1) },
      { merge: true },
    )
    transaction.create(collection().doc(hash), data)
  })

  // Plaintext is returned only by creation and is never written to Firestore.
  return { key, metadata: toClient(hash, data) }
}

export async function listApiKeysForUser(uid: string) {
  if (!uid) throw new Error('Unauthorized')
  const snapshot = await collection().where('uid', '==', uid).get()
  return snapshot.docs
    .map((doc) => toClient(doc.id, doc.data() as IApiKey))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function revokeApiKeyForUser(uid: string, id: string) {
  if (!uid) throw new Error('Unauthorized')
  if (typeof id !== 'string' || !/^[a-f0-9]{64}$/.test(id)) {
    throw new ApiKeyError('not_found')
  }
  await _db.runTransaction(async (transaction) => {
    const ref = collection().doc(id)
    const snapshot = await transaction.get(ref)
    const data = snapshot.data() as IApiKey | undefined
    if (!data || data.uid !== uid) throw new ApiKeyError('not_found')
    if (!data.revokedAt) transaction.update(ref, { revokedAt: Timestamp.now() })
  })
}

/** No cached auth: revocations are checked with a direct hash document lookup. */
export async function resolveApiKey(key: string) {
  if (!KEY_PATTERN.test(key)) return null
  const ref = collection().doc(hashKey(key))
  const snapshot = await ref.get()
  const data = snapshot.data() as IApiKey | undefined
  if (!data?.uid || data.revokedAt) return null

  return {
    uid: data.uid,
    // The route schedules this after the response; failures never reject auth.
    async touchLastUsed() {
      if (
        data.lastUsedAt &&
        Date.now() - data.lastUsedAt.toMillis() < LAST_USED_INTERVAL_MS
      )
        return
      try {
        await _db.runTransaction(async (transaction) => {
          const current = (await transaction.get(ref)).data() as
            | IApiKey
            | undefined
          if (!current || current.revokedAt) return
          if (
            current.lastUsedAt &&
            Date.now() - current.lastUsedAt.toMillis() < LAST_USED_INTERVAL_MS
          )
            return
          transaction.update(ref, { lastUsedAt: Timestamp.now() })
        })
      } catch {
        console.error('Failed to update API key last-used timestamp')
      }
    },
  }
}
