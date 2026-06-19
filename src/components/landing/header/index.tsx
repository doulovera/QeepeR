'use server'

import Link from 'next/link'
import { getUserMe } from '@/data/services/get-user-me-service'
import { LoginHeader } from './login'

export const Header = async () => {
  const user = await getUserMe()

  return (
    <header className="w-full border-b-4 border-black bg-white px-4">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between py-4 sm:h-24">
        <h2 className="text-4xl font-black tracking-normal sm:text-5xl">
          <Link href="/">QeepeR</Link>
        </h2>
        <nav className="flex items-center gap-3 text-sm font-black sm:gap-8 sm:text-lg">
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
