'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from '@/i18n/provider'

import { ChevronDown } from '@/components/icons/chevron-down'
import { LogOut } from '@/components/icons/log-out'
import { Button } from '@/components/ui/button'
import { logInWithGoogle, logOut } from '@/data/services/auth-service'
import { cn } from '@/lib'

type Props = {
  name?: string
}

function AccountMenu({ name }: { name: string }) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const handleLogOut = async () => {
    setIsOpen(false)
    const response = await logOut()
    if (response) {
      window.location.reload()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* One bordered group; the divider between both halves is the shared border */}
      <div className="flex h-10 items-stretch rounded-base border-2 border-border bg-secondary-background shadow-shadow">
        <Link
          href="/profile"
          title={t('profile')}
          className="flex items-center rounded-l-base px-3 transition-colors hover:bg-main/20"
        >
          {name.split(' ')[0]}
        </Link>
        <button
          type="button"
          aria-label={t('accountMenu')}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center rounded-r-base border-l-2 border-border px-2 transition-colors',
            isOpen ? 'bg-main/20' : 'hover:bg-main/20',
          )}
        >
          <ChevronDown
            className={cn(
              'size-5 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-3 flex min-w-40 flex-col border-4 border-black bg-white shadow-[6px_6px_0_#000]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogOut}
            className="flex items-center gap-2 px-4 py-3 text-left text-sm font-black uppercase text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="size-5 shrink-0" />
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  )
}

export function LoginHeader({ name }: Props) {
  const t = useTranslations()
  const handleLogIn = async () => {
    const response = await logInWithGoogle()
    if (response) {
      window.location.reload()
    }
  }

  if (name) return <AccountMenu name={name} />

  return (
    <Button onClick={handleLogIn}>
      <span className="px-4">{t('login')}</span>
    </Button>
  )
}
