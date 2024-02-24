import type { WranglerEnv } from '..'

import * as db from './db'
import { getRandomString } from '../utils/get-random-string'

export const createQrLink = async (c: { env: WranglerEnv }, url: string) => {
  const key = getRandomString()
  const response = await db.set(c, key, url)

  if (!response) {
    throw new Error('Failed to create QR link')
  }

  return key
}

export const getQrLink = async (c: { env: WranglerEnv }, key: string): Promise<string> => {
  const url = await db.get(c, key)

  if (!url) {
    throw new Error('QR link not found')
  }

  return url
}
