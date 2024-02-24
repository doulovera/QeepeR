import type { WranglerEnv } from '..'
import type { QrResponse } from './db'

import * as db from './db'
import { getRandomString } from '../utils/get-random-string'

export const createQrLink = async (c: { env: WranglerEnv }, url: string) => {
  const key = getRandomString()
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
