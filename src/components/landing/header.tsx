'use client'

import useAuth from "@/hooks/useAuth";
import { logInWithGoogle, logOut } from "@/lib/auth";

export const Header = () => {
  const user = useAuth();

  return (
    <header className="flex items-center justify-center w-80 h-20 p-4 mx-auto">
      <nav className="w-full">
        <ul className="flex justify-between w-full">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              href="/qr"
              className={!user ? 'opacity-70 cursor-not-allowed' : ''}
            >
              My QRs
            </a>
          </li>
          <li>
            <a href="/about">About</a>
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