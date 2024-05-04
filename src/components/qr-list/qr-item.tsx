'use server'

import { QrItemContent } from "./qr-item-content";

export default async function QrItem (
  { user, id }:
  { user: { accessToken: string }, id: string }
) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  const res = await fetch(
    `${API_BASE_URL}/gen/info/${id}?img=true`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`
      },
      next: { revalidate: 0 },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    console.error('Error fetching QR code')
    return null
  }

  const data: Response = await res.json()

  if (!data.success) {
    console.error('Error fetching QR code')
    return null
  }

  const response = data.response

  const visitorsCount = 0

  return (
    <>
      <QrItemContent
        visitorsCount={0}
        {...response}
      />
    </>
  )
}

/// TODO: put in correct file
export type QrInfoResponse = {
  id: string;
  created: string | undefined;
  disabled: boolean;
  destinationUrl: string;
  length: number
  page: number
  image: string
  next: string | null
  previous: string | null
}
type Response = {
  success: boolean
  response: QrInfoResponse
}
