'use server'

import { WORKER_BASE_URL } from '@/constants/app'

type Response =
  | {
      success: true
      svg: string
    }
  | {
      success: false
    }

export async function createQR({ url }: { url: string }): Promise<Response> {
  if (!WORKER_BASE_URL) throw new Error('Worker base URL is not set')

  const response = await fetch(WORKER_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate QR')
  }

  return response.json()
}
