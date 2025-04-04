'use server'

import { generateQr } from '@/utils/generate-qr'
import { transformTimestamp } from '@/utils/transform-timestamp'
import { getWorkerUrl } from '@/utils/get-worker-url'

import { getUserMe } from '@/data/services/get-user-me-service'
import {
  addQR,
  deleteQRInDB,
  updateDisableQRInDB,
  listUserQrs,
  updateQRUrlInDB,
  getOneQRInDB,
} from '@/data/services/qr-db-service'
import {
  createWorkerQR,
  deleteWorkerQR,
  updateUrlWorkerQR,
} from '@/data/services/qr-object-service'

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

    if (!response || !response.length) {
      return []
    }

    const mapped = response.map(async (item) => ({
      ...item,
      createdAt: transformTimestamp(item?.createdAt),
      svg: await generateQr(getWorkerUrl(item.alias)),
    }))

    const result = await Promise.all(mapped)

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteDynamicQR(key: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const workerResponse = await deleteWorkerQR(key)
    const dbResponse = await deleteQRInDB(key)

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to delete QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function disableDynamicQR(key: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const dbResponse = await updateDisableQRInDB(key, true)
    const workerResponse = await deleteWorkerQR(key)

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to disable QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function enableDynamicQR(key: string) {
  try {
    const user = await getUserMe()
    const qr = await getOneQRInDB(key)

    if (!user || !qr) {
      throw new Error('Unauthorized')
    }

    const dbResponse = await updateDisableQRInDB(key, false)
    const workerResponse = await createWorkerQR(qr?.destinationUrl, { key })

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to enable QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
