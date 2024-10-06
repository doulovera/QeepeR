'use server'

import Link from "next/link";

import { getUserMe } from "@/data/services/get-user-me";
import { LoginHeader } from "./login";

export const Header = async () => {
  const user = await getUserMe()

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
            <LoginHeader name={user?.name ?? undefined} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
