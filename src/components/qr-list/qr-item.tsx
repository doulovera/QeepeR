'use server'

export default async function QrItem (
  { user, id }:
  { user: { accessToken: string }, id: string }
) {
  return <p>test</p>
}
