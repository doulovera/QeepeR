import type { WranglerEnv } from '../types'
import type { QrResponse } from './db'

import * as db from './db'
import { getRandomString } from '../utils/get-random-string'

export const createQrLink = async (c: { env: WranglerEnv }, url: string, defaultKey?: string) => {
  let key = defaultKey || undefined

  if (!key) key = getRandomString()
  const response = await db.set(c, key, { url, views: 0 })

  if (!response) {
    throw new Error('Failed to create QR link')
  }

  return key
}

export const getQrLink = async (c: { env: WranglerEnv }, key: string): Promise<QrResponse> => {
  const qr = await db.get(c, key)

  if (!qr) {
    throw new Error('QR link not found')
  }

  return sumView(c, { key, qr })
}

export const sumView = async (c: { env: WranglerEnv }, qrInfo: { key: string, qr: QrResponse }) => {
  if (qrInfo.qr.views == null) return qrInfo.qr

  const copyOfQr = {
    ...qrInfo.qr,
    views: qrInfo.qr.views + 1
  }

  const response = await db.set(c, qrInfo.key, copyOfQr)

  if (!response) {
    throw new Error('Failed to update QR link')
  }

  return copyOfQr
}

export const deleteQrLink = async (c: { env: WranglerEnv }, key: string) => {
  const response = await db.del(c, key)

  if (!response) {
    throw new Error('Failed to delete QR link')
  }
}

export const updateQrLink = async (c: { env: WranglerEnv }, key: string, url: string, options: { views: number | null }) => {  
  const copyOfQr = {
    url,
    views: options?.views ?? null
  }

  const response = await db.set(c, key, copyOfQr)

  if (!response) {
    throw new Error('Failed to update QR link')
  }

  return copyOfQr
}
