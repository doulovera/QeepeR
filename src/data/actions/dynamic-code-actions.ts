'use server'

import { generateQr } from '@/utils/generate-qr'
/*
  1. get
  2. update
  3. create
  4. list
  5. delete
*/

import { getUserMe } from '../services/get-user-me-service'
import {
  addQR,
  listUserQrs,
  updateQRUrlInDB,
} from '../services/qr-db-service'
import {
  createWorkerQR,
  updateUrlWorkerQR,
} from '../services/qr-object-service'
import { transformTimestamp } from '@/utils/transform-timestamp'

export async function createDynamicQR(url: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const workerQR = await createWorkerQR(url)

    if (!workerQR) {
      throw new Error('Failed to create QR')
    }

    await addQR(workerQR.key, { url, uid: user.uid })

    const svg = await generateQr(workerQR.url)

    return svg
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateUrlDynamicQR(key: string, url: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Be careful with a mismatch between both DBs services
    const workerResponse = await updateUrlWorkerQR(key, url)
    const dbResponse = await updateQRUrlInDB(key, url)

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to update QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function listDynamicQRs() {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const response = await listUserQrs(user.uid)

    const mapped = response?.map((item) => ({
      ...item,
      createdAt: transformTimestamp(item?.createdAt),
      svg: '',
    }))

    return mapped
  } catch (error) {
    console.error(error)
    return null
  }
}
