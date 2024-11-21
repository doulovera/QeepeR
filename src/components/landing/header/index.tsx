'use server'

import Link from "next/link";
import { getUserMe } from "@/data/services/get-user-me-service";
import { LoginHeader } from "./login";

export const Header = async () => {
  const user = await getUserMe()

  return (
    <header className="flex items-center justify-between w-full h-20 py-4 mx-auto">
      <h2 className="text-xl font-bold">
        QeepeR
      </h2>
      <nav>
        <ul className="flex justify-between w-full gap-10">
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
          </li>
        </ul>
      </nav>
      <LoginHeader name={user?.name ?? undefined} />
    </header>
  );
}
