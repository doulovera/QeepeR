import type { QrObject } from "@/types/qr"

import { getFromLocalStorage } from "@/utils/get-from-localstorage"
import { LOCALSTORAGE_KEYS } from "@/constants"
import { routes } from "../routes"

interface Response {
  success: true
  response: QrObject
}

export const updateQr = async (
  { id, newUrl, disabled, disableViews }:
  {
    id?: string
    newUrl?: string
    disabled?: boolean
    disableViews?: boolean
  }
) => {
  const accessToken = getFromLocalStorage(LOCALSTORAGE_KEYS.ACCESS_TOKEN)

  const res = await fetch(`${routes.qrGeneration}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url: newUrl,
      disabled,
      disableViews
    })
  })

  if (!res.ok) throw new Error('Failed to update QR code')

  const response: Response = await res.json()

  return response.response  
}