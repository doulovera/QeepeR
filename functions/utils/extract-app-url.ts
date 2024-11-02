import { API_RESPONSE } from "../constants/errors"
import ApplicationError from "../lib/error"

export const extractAppUrl = (url: string) => {
  if (url.includes('localhost')) return 'https://qr-generator.doulovera.workers.dev'

  const regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm
  const appUrl = url.match(regex)?.[0]
  if (!appUrl) throw new ApplicationError(API_RESPONSE.INTERNAL_SERVER_ERROR.TITLE, API_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE, 500)
  return appUrl
}