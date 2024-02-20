import * as db from '../db'
import { getRandomString } from './get-random-string'

export const createQrLink = async (url: string) => {
  const key = getRandomString()
  const response = await db.set(key, url)

  if (!response) {
    throw new Error('Failed to create QR link')
  }

  return key
}

export const getQrLink = async (key: string): Promise<string> => {
  const url = await db.get(key)

  if (!url) {
    throw new Error('QR link not found')
  }

  return url
}
