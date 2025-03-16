'use server'

import Link from 'next/link'
import { getUserMe } from '@/data/services/get-user-me-service'
import { LoginHeader } from './login'

export const Header = async () => {
  const user = await getUserMe()

  return (
    <header className="w-full px-4 bg-white border-b-base border-base-400">
      <div className="max-w-4xl flex items-center justify-between w-full h-20 py-4 mx-auto">
        <h2 className="text-2xl font-extrabold">
          <Link href="/">QeepeR</Link>
        </h2>
        <nav className="flex items-center gap-4 sm:gap-10">
          <span
            className={`font-bold ${!user ? 'opacity-70 cursor-not-allowed' : 'hover:underline'}`}
          >
            {user ? <Link href="/qr">My QR Codes</Link> : 'My QR codes'}
          </span>
          <LoginHeader name={user?.name ?? undefined} />
        </nav>
      </div>
    </header>
  )
}
