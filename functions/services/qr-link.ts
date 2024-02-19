import * as db from '../db'
import { getRandomString } from './get-random-string'

export const createQrLink = async (url: string) => {
  const key = getRandomString()
  const response = db.set(key, url)

  if (!response) {
    throw new Error('Failed to create QR link')
  }

  return key
}

export const getQrLink = async (key: string) => {}
