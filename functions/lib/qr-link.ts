import type { WranglerBindings } from '../types'
import type { QrResponse } from './db'

import * as db from './db'
import ApplicationError from './error'
import { getRandomString } from '../utils/get-random-string'

const MAX_KEY_ATTEMPTS = 5
const MAX_URL_LENGTH = 8192
const KEY_PATTERN = /^[A-Za-z0-9_-]{1,128}$/

/**
 * Only absolute http(s) URLs can be stored or redirected to. The worker used
 * to accept anything its caller sent (the web app validated, the worker didn't).
 */
export const isValidDestination = (url: unknown): url is string => {
  if (typeof url !== 'string' || !url || url.length > MAX_URL_LENGTH) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const assertDestination = (url: unknown) => {
  if (!isValidDestination(url)) {
    throw new ApplicationError('Invalid URL', 'Enter a valid HTTP or HTTPS URL.', 400)
  }
}

export const isValidKey = (key: unknown): key is string => typeof key === 'string' && KEY_PATTERN.test(key)

/**
 * Stores a new link. Without a key, it picks a random one that is not taken:
 * before, a collision silently overwrote another account's QR. A caller-given
 * key (re-enabling or restoring a known QR) is written as is, on purpose.
 */
export const generateQrLink = async (c: { env: WranglerBindings }, url: string, defaultKey?: string) => {
  assertDestination(url)

  let key = defaultKey || undefined
  if (key !== undefined && !isValidKey(key)) {
    throw new ApplicationError('Invalid key', 'The key can only use letters, numbers, "_" and "-".', 400)
  }

  for (let attempt = 0; !key && attempt < MAX_KEY_ATTEMPTS; attempt++) {
    const candidate = getRandomString()
    if ((await db.get(c, candidate)) === null) key = candidate
  }
  if (!key) throw new Error('Failed to find a free key for the QR link')

  const response = await db.set(c, key, url)

  if (!response) {
    throw new Error('Failed to create QR link')
  }

  return key
}

export const getQrLink = async (c: { env: WranglerBindings }, key: string): Promise<QrResponse | null> => {
  const qr = await db.get(c, key)

  if (!qr) {
    return null
  }

  return qr
}

/** Counts a scan when view tracking is on for the link (see db.toggleViews). */
export const sumView = async (c: { env: WranglerBindings }, qrInfo: { key: string, qr: QrResponse }) => {
  return db.incrementViews(c, qrInfo.key)
}

export const deleteQrLink = async (c: { env: WranglerBindings }, key: string) => {
  const response = await db.del(c, key)

  if (!response) {
    throw new Error('Failed to delete QR link')
  }
}

export const updateQrLink = async (c: { env: WranglerBindings }, key: string, url: string) => {
  assertDestination(url)
  const response = await db.set(c, key, url)

  if (!response) {
    throw new Error('Failed to update QR link')
  }

  return url
}

export const getQrViews = async (c: { env: WranglerBindings }, key: string): Promise<number | null> => {
  const views = await db.getViews(c, key)
  return views
}

export const toggleQrViews = async (c: { env: WranglerBindings }, key: string): Promise<number | null> => {
  return db.toggleViews(c, key)
}
