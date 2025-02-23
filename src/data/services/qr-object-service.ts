import { WORKER_API_TOKEN, WORKER_BASE_URL } from '@/constants/app'

const PATH = '/code'

const httpRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: Record<string, unknown> | null,
) => {
  const response = await fetch(`${WORKER_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WORKER_API_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw response
  }

  return response.json()
}

export async function fetchInfoWorkerQR(id: string) {
  try {
    const item = await httpRequest('GET', `${PATH}/${id}/info`)

    return item
  } catch (error) {
    console.log(error)
    return null
  }
}

interface CreateWorkerQRResponse {
  success: boolean
  key: string
  url: string
}
export async function createWorkerQR(
  url: string,
): Promise<CreateWorkerQRResponse | null> {
  try {
    const item = await httpRequest('POST', `${PATH}/create`, { url })
    return item
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function updateUrlWorkerQR(id: string, url: string) {
  try {
    const item = await httpRequest('PUT', `${PATH}/${id}/url`, { url })

    return item
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function deleteWorkerQR(id: string) {
  try {
    const item = await httpRequest('DELETE', `${PATH}/${id}`)
    return item
  } catch (error) {
    console.log(error)
    return null
  }
}
