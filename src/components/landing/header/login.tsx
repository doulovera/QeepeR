'use client'

import { Button } from "@/components/shared/button"
import { logInWithGoogle, logOut } from "@/data/services/auth-service"

type Props = {
  name?: string
}

export function LoginHeader({ name }: Props) {
  const handleLogIn = async () => {
    const response = await logInWithGoogle()
    if (response) {
      window.location.reload()
    }
  }

  const handleLogOut = async () => {
    const response = await logOut()
    if (response) {
      window.location.reload()
    }
  }

  return (
    <Button
      onClick={name ? handleLogOut : handleLogIn}
      color={name ? 'primary' : 'light'}
    >
      <span className="px-4">
        {
          name
            ? name.split(' ')[0]
            : 'Login'
        }
      </span>
    </Button>
  )

}