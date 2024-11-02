import type { HonoContext, QeeperCtx } from "../types"
import { Hono } from "hono"
import { successPayload, errorPayload } from "../lib/response"
import ApplicationError from "../lib/error"
import { generateQr } from "../utils/generate-qr"
import { API_RESPONSE } from "../constants/errors"

export default function mainRoutes() {
  const mainRoutes = new Hono<HonoContext>()

  mainRoutes.post('/', generateQR)

  return mainRoutes
}

/**
 * This is the main controller for the application. It handles incoming requests by parsing the request body,
 * validating the presence of a URL, generating a QR code for the URL, and returning a success payload with the QR code.
 * If any errors occur during this process, it returns an error payload.
 */
export const generateQR = async (c: QeeperCtx) => {
  /// TODO : do something to avoid infinite loop (using the same url as the one that is being called)
  try {
    const body = await c.req.json()
    if (!body) throw new ApplicationError(API_RESPONSE.MISSING_BODY.TITLE, API_RESPONSE.MISSING_BODY.MESSAGE, 400)

    const { url } = body
    if (!url) throw new ApplicationError(API_RESPONSE.MISSING_BODY_KEY.TITLE, API_RESPONSE.MISSING_BODY_KEY.MESSAGE('url'), 400)

    const svg = await generateQr(url)
    return successPayload(c, { success: true, svg })
  } catch (error) {
    return errorPayload(c, error as Error)
  }
}
