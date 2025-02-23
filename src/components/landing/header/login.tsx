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

  if (name) {
    return (
      <div className="flex items-center gap-4">
        <p>{name.split(' ')[0]}</p>
        <Button onClick={handleLogOut} color="light" size="small">
          ↪
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleLogIn}
      color="primary"
    >
      <span className="px-4">
        Login
      </span>
    </Button>
  )

}