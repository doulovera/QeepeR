'use server'

import { getCurrentUser } from "@/lib/firebase/admin";

export const Name = async () => {
  const user = await getCurrentUser()
  console.log(user)
  return <span>yellow</span>
}