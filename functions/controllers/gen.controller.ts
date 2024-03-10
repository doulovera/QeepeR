import type { HonoContext, QeeperCtx } from "../types"
import { Hono } from "hono"
import { successPayload, errorPayload } from "../lib/response"
import ApplicationError from "../lib/error"
import { generateQr } from "../utils/generate-qr"
import { API_RESPONSE } from "../constants/errors"

import { createQrLink } from "../lib/qr-link"
import { createQrInfoDB, getUserQrListDB } from "../lib/firestore"

export default function genRoutes() {
  const gen = new Hono<HonoContext>()

  gen.get('/list', listUserQrs)
  gen.post('/perma', permaQr)

  return gen
}

/**
 * This is the controller for generating a permanent QR code. It handles incoming requests by parsing the request body,
 * validating the presence of a URL, generating a QR code for the URL, and returning a success payload with the QR code.
 * If any errors occur during this process, it returns an error payload.
 */
export const permaQr = async (c: QeeperCtx) => {
  try {
    const body = await c.req.json()
    if (!body) throw new ApplicationError(API_RESPONSE.MISSING_BODY.TITLE, API_RESPONSE.MISSING_BODY.MESSAGE, 400)

    const { url } = body
    if (!url) throw new ApplicationError(API_RESPONSE.MISSING_BODY_KEY.TITLE, API_RESPONSE.MISSING_BODY_KEY.MESSAGE('url'), 400)

    const key = await createQrLink(c, url)
    
    await createQrInfoDB(c, { key, destinationUrl: url })

    const appUrl = c.req.url.replace('/perma', '')
    const qrUrl = `${appUrl}/${key}`
    const svg = await generateQr(qrUrl)

    return successPayload(c, { success: true, svg, key })
  } catch (error) {
    return errorPayload(c, error as Error)
  }
}

/**
 * This is the controller for listing all the QR codes for the user. It handles incoming requests by fetching the list of QR codes
 * from the database and returning a success payload with the list of QR codes. If any errors occur during this process, it returns an error payload.
 */
export const listUserQrs = async (c: QeeperCtx) => {
  try {
    const qrList = await getUserQrListDB(c)
    
    const img = c.req.query('img')

    if (img) {
      const qrListWithQr = await Promise.all(qrList.map(async (qr) => {
        const svg = await generateQr(qr.destinationUrl)
        return { ...qr, svg }
      }))

      return successPayload(c, { success: true, images: img, result: qrListWithQr })
    }

    return successPayload(c, { success: true, images: img, result: qrList })
  } catch (error) {
    return errorPayload(c, error as Error)
  }
}