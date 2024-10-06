import { getUserByCookie } from "@/lib/firebase/admin"

type User = {
  uid: string
  email?: string
  picture?: string
  name: string
}

export async function getUserMe (): Promise<User | null> {
  try {
    const user = await getUserByCookie()

    if (!user) {
      throw new Error('Failed to get user')
    }

    const { uid, email, picture, name } = user
    return { uid, email, picture, name }
  } catch (error) {
    console.error(error)
    return null
  }
}