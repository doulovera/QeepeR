'use server'

export default async function QrItem (
  { user, id }:
  { user: { accessToken: string }, id: string }
) {
  return <p>test</p>
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
