import type { WranglerBindings } from '../types'
import type { QrResponse } from './db'

import * as db from './db'
import { getRandomString } from '../utils/get-random-string'

export const generateQrLink = async (c: { env: WranglerBindings }, url: string, defaultKey?: string) => {
  let key = defaultKey || undefined

  if (!key) key = getRandomString()
  const response = await db.set(c, key, url)

  if (!response) {
    throw new Error('Failed to create QR link')
  }

  return key
}

export const getQrLink = async (c: { env: WranglerBindings }, key: string): Promise<QrResponse> => {
  const qr = await db.get(c, key)

  if (!qr) {
    throw new Error('QR link not found')
  }

  return qr
}

export const sumView = async (c: { env: WranglerBindings }, qrInfo: { key: string, qr: QrResponse }) => {
  // search in KV for `views:${key}`
  // if it doesn't exist, create it with value "null"
  // if it does exist and it's not "null", increment the value by 1
}

export const deleteQrLink = async (c: { env: WranglerBindings }, key: string) => {
  const response = await db.del(c, key)

  if (!response) {
    throw new Error('Failed to delete QR link')
  }
}

export const updateQrLink = async (c: { env: WranglerBindings }, key: string, url: string) => {  
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
