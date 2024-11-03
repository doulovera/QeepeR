'use server'

/*
  1. get
  2. update
  3. create
  4. list
  5. delete
*/

import { addQR, listUserQrs } from "../services/qr-db-service"
import { getUserMe } from "../services/get-user-me-service"
import { createWorkerQR, updateUrlWorkerQR } from "../services/qr-object-service"

export async function createPermaQR (url: string) {
  try {
    const workerQR = await createWorkerQR(url)

    if (!workerQR) {
      throw new Error('Failed to create QR')
    }

    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    await addQR(workerQR.key, { url, uid: user.uid })

    return workerQR.svg
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateUrlPermaQR (key: string, url: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const response = await updateUrlWorkerQR(key, url)

    if (!response) {
      throw new Error('Failed to update QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function listPermaQRs () {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const response = await listUserQrs(user.uid)

    return response
  } catch (error) {
    console.error(error)
    return null
  }
}
