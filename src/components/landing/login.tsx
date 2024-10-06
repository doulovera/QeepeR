'use client'

import { logInWithGoogle, logOut } from "@/data/actions/auth";

type Props = {
  name?: string
}

export const LoginHeader = ({ name }: Props) => {

  const handleLogIn = async () => logInWithGoogle()
  const handleLogOut = () => logOut()
  
  if (!name) {
    return (
      <button onClick={handleLogIn}>
        Login
      </button>
    )
  }

  return <button onClick={handleLogOut}>
    {name}
  </button>

}