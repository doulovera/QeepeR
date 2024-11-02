'use server'

/*
  1. get
  2. update
  3. create
  4. list
  5. delete
*/

import { getUserMe } from "../services/get-user-me-service"
import { addQR } from "../services/qr-db-service"
import { createWorkerQR } from "../services/qr-object-service"

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
    console.log(error)
    return null
  }
}
