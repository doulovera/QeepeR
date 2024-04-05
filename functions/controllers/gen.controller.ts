import type { HonoContext, QeeperCtx } from "../types"
import { Hono } from "hono"
import { successPayload, errorPayload } from "../lib/response"
import ApplicationError from "../lib/error"
import { generateQr } from "../utils/generate-qr"
import { API_RESPONSE } from "../constants/errors"

import { createQrLink, deleteQrLink, updateQrLink } from "../lib/qr-link"
import { createQrInfoDB, getQrInfoByKey, getUserQrListDB, updateQrDB, validateUserQrDB } from "../lib/firestore"

export default function genRoutes() {
  const gen = new Hono<HonoContext>()

  gen.get('/list', listUserQrs)
  gen.post('/perma', permaQr)
  gen.put('/update/:key', updateQrInfo)

  return gen
}

/**
 * This is the controller for generating a permanent QR code. It handles incoming requests by parsing the request body,
 * validating the presence of a URL, generating a QR code for the URL, and returning a success payload with the QR code.
 * If any errors occur during this process, it returns an error payload.
 * @param c The Hono context
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
 * @param c The Hono context
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

/**
 * This is the controller for updating the information of a QR code. It handles incoming requests by parsing the request body,
 * validating the presence of a key, and updating the URL, disabled status, and views status of the QR code. It returns a success payload
 * with the updated information of the QR code. If any errors occur during this process, it returns an error payload.
 * @param c The Hono context
 */
export const updateQrInfo = async (c: QeeperCtx) => {
  /// TODO :: FIX - if it's disabled, it shouldn't appear in upstash if any other setting is updated
  try {
    const body = await c.req.json()
    if (!body) throw new ApplicationError(API_RESPONSE.MISSING_BODY.TITLE, API_RESPONSE.MISSING_BODY.MESSAGE, 400)

    const key = c.req.param('key')
    if (!key) throw new ApplicationError(API_RESPONSE.MISSING_BODY_KEY.TITLE, API_RESPONSE.MISSING_BODY_KEY.MESSAGE('key'), 400)
    await validateUserQrDB(c, key)

    const { url: newUrl, disabled, disableViews } = body

    const qrInfo = await getQrInfoByKey(c, key)
    if (!qrInfo) throw new ApplicationError(API_RESPONSE.NOT_FOUND.TITLE, API_RESPONSE.NOT_FOUND.MESSAGE, 404)

    const response: Record<string, any> = qrInfo
    delete response.user

    // Change URL
    if (newUrl && newUrl !== qrInfo.destinationUrl) {
      await updateQrLink(c, key, newUrl, { views: 0 })
      await updateQrDB(c, key, { destinationUrl: newUrl })
      response.destinationUrl = newUrl
    }

    // Change disabled status
    if (disabled !== undefined && disabled !== qrInfo.disabled) {
      if (disabled === true) await deleteQrLink(c, key)
      if (disabled === false) {
        await createQrLink(c, qrInfo.destinationUrl, key)
        response.views = 0
      }
      await updateQrDB(c, key, { disabled })
      response.disabled = disabled
    }

    // Change views status
    if (disableViews !== undefined) {
      await updateQrLink(c, key, qrInfo.destinationUrl, { views: disableViews ? null : 0 })
      response.views = disableViews ? null : 0
    }

    return successPayload(c, { success: true, response })
  } catch (error) {
    console.log(error)
    return errorPayload(c, error as Error)
  }
}
