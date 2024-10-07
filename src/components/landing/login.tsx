'use client'

import { logInWithGoogle, logOut } from "@/data/services/auth-service"

type Props = {
  name?: string
}

export const LoginHeader = ({ name }: Props) => {

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
  
  if (!name) {
    return (
      <button onClick={handleLogIn}>
        Login
      </button>
    )
  }

  return (
    <button onClick={handleLogOut}>
      {name.split(' ')[0]}
    </button>
  )

}