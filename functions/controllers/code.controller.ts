import type { HonoContext, QeeperCtx } from "../types"
import type { GetQrInfoResponse } from "../types/responses"

import { Hono } from "hono"

import { successPayload, errorPayload } from "../lib/response"
import ApplicationError from "../lib/error"
import { deleteQrLink, generateQrLink, getQrLink, getQrViews, updateQrLink } from "../lib/qr-link"

import { generateQr } from "../utils/generate-qr"
import { API_RESPONSE } from "../constants/errors"
import { extractAppUrl } from "../utils/extract-app-url"

export default function genRoutes() {
  const code = new Hono<HonoContext>()

  code.get('/:key/info', getInfoPermaQR)
  code.post('/create', createPermaQR)
  code.put('/:key/url', updateUrlPermaQR)

  // update qr views status
  // update qr disabled status (not implement yet)

  return code
}

/**
 * This is the controller for generating a permanent QR code. It handles incoming requests by parsing the request body,
 * validating the presence of a URL, generating a QR code for the URL, and returning a success payload with the QR code.
 * If any errors occur during this process, it returns an error payload.
 * @param c The Hono context
 */
export const createPermaQR = async (c: QeeperCtx) => {
  try {
    const body = await c.req.json()
    if (!body) throw new ApplicationError(API_RESPONSE.MISSING_BODY.TITLE, API_RESPONSE.MISSING_BODY.MESSAGE, 400)

    const { url } = body
    if (!url) throw new ApplicationError(API_RESPONSE.MISSING_BODY_KEY.TITLE, API_RESPONSE.MISSING_BODY_KEY.MESSAGE('url'), 400)

    const key = await generateQrLink(c, url)
    const appUrl = extractAppUrl(c.req.url)
    const qrUrl = `${appUrl}/${key}`
    const svg = await generateQr(qrUrl)

    return successPayload(c, { success: true, svg, key })
  } catch (error) {
    return errorPayload(c, error as Error)
  }
}

/**
 * This is the controller for getting the information of a QR code. It handles incoming requests by parsing the request parameters,
 * validating the presence of a key, and fetching the information of the QR code. It returns a success payload with the information
 * of the QR code. If any errors occur during this process, it returns an error payload.
 * @param c The Hono context
 */
export const getInfoPermaQR = async (c: QeeperCtx) => {
  try {
    const key = c.req.param('key')
    if (!key) throw new ApplicationError(API_RESPONSE.MISSING_BODY_KEY.TITLE, API_RESPONSE.MISSING_BODY_KEY.MESSAGE('key'), 400)

    const destinationUrl = await getQrLink(c, key)
    const views = await getQrViews(c, key)
    const isViewsDisabled = views === null

    const response = {
      destinationUrl,
      views,
      viewsDisabled: isViewsDisabled
    }

    return successPayload(c, { success: true, response })
  } catch (error) {
    return errorPayload(c, error as Error)
  }

}

export const updateUrlPermaQR = async (c: QeeperCtx) => {
  try {
    const body = await c.req.json()
    if (!body) throw new ApplicationError(API_RESPONSE.MISSING_BODY.TITLE, API_RESPONSE.MISSING_BODY.MESSAGE, 400)

    const key = c.req.param('key')
    if (!key) throw new ApplicationError(API_RESPONSE.MISSING_BODY_KEY.TITLE, API_RESPONSE.MISSING_BODY_KEY.MESSAGE('key'), 400)

    const qr = await getQrLink(c, key)
    if (!qr) throw new ApplicationError(API_RESPONSE.NOT_FOUND.TITLE, API_RESPONSE.NOT_FOUND.MESSAGE, 404)

    const { url: newUrl } = body
    const response = await updateQrLink(c, key, newUrl)

    return successPayload(c, { success: true, url: response })
  } catch (error) {
    return errorPayload(c, error as Error)
  }
}
