'use client'

import useAuth from "@/hooks/useAuth";
import { logInWithGoogle, logOut } from "@/lib/auth";
import Link from "next/link";

export const Header = () => {
  const user = useAuth();

  return (
    <header className="flex items-center justify-center w-80 h-20 p-4 mx-auto">
      <nav className="w-full">
        <ul className="flex justify-between w-full">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            {
              user
                ? (
                  <Link
                    href="/qr"
                    className={!user ? 'opacity-70 cursor-not-allowed' : ''}
                  >
                    My QRs
                  </Link>
                )
                : <span className={!user ? 'opacity-70 cursor-not-allowed' : ''}>My QRs</span>
            }
          </li>
          <li>
            {
              user 
                ? <button onClick={logOut}>{user.name.split(' ')[0]}</button>
                : <button onClick={logInWithGoogle}>Log in</button>
            }
          </li>
        </ul>
      </nav>
    </header>
  );
}