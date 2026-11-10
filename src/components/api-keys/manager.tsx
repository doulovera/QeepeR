'use client'

import { useState, type FormEvent } from 'react'
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from '@/data/actions/api-key-actions'
import type { ClientApiKey } from '@/data/models/IApiKey'
import { useTranslations } from '@/i18n/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ApiKeyManager({
  initialKeys,
  defaultOpen = false,
}: { initialKeys: ClientApiKey[] | null; defaultOpen?: boolean }) {
  const t = useTranslations()
  const [keys, setKeys] = useState(initialKeys)
  const [name, setName] = useState('')
  const [secret, setSecret] = useState<{ id: string; value: string } | null>(
    null,
  )
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const result = await createApiKey(name)
      if (!result.ok) {
        setError(
          t(
            result.error === 'key_limit'
              ? 'apiKeyLimit'
              : result.error === 'invalid_name'
                ? 'apiKeyInvalidName'
                : 'apiKeyError',
          ),
        )
        return
      }
      setSecret({ id: result.data.metadata.id, value: result.data.key })
      setCopied(false)
      setName('')
      const listed = await listApiKeys()
      if (listed.ok) setKeys(listed.data)
      else
        setKeys((current) =>
          current ? [result.data.metadata, ...current] : null,
        )
    } catch {
      setError(t('apiKeyError'))
    } finally {
      setPending(false)
    }
  }

  async function handleRefresh() {
    setPending(true)
    setError('')
    try {
      const result = await listApiKeys()
      if (result.ok) setKeys(result.data)
      else setError(t('apiKeyError'))
    } catch {
      setError(t('apiKeyError'))
    } finally {
      setPending(false)
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm(t('apiKeyConfirmRevoke'))) return
    setPending(true)
    setError('')
    try {
      const result = await revokeApiKey(id)
      if (!result.ok) {
        setError(t('apiKeyError'))
        return
      }
      setKeys(
        (current) =>
          current?.map((key) =>
            key.id === id
              ? { ...key, revokedAt: new Date().toISOString() }
              : key,
          ) ?? null,
      )
      if (secret?.id === id) setSecret(null)
    } catch {
      setError(t('apiKeyError'))
    } finally {
      setPending(false)
    }
  }

  async function handleCopy() {
    if (!secret) return
    try {
      await navigator.clipboard.writeText(secret.value)
      setCopied(true)
    } catch {
      setError(t('apiKeyCopyError'))
    }
  }

  return (
    <details
      open={defaultOpen}
      className="border-4 border-black bg-white p-5 shadow-[6px_6px_0_#000]"
    >
      <summary className="cursor-pointer text-xl font-black uppercase">
        {t('apiKeys')}
      </summary>
      <p className="my-4 text-sm">{t('apiKeysHelp')}</p>
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex-1 font-bold" htmlFor="api-key-name">
          {t('apiKeyName')}
          <Input
            id="api-key-name"
            className="mt-2 rounded-none"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('apiKeyNamePlaceholder')}
            maxLength={80}
            required
            disabled={pending}
          />
        </label>
        <Button
          type="submit"
          className="rounded-none font-black"
          disabled={pending || !name.trim()}
        >
          {t('apiKeyCreate')}
        </Button>
      </form>
      {secret && (
        <div
          className="mt-5 border-2 border-dashed border-black bg-main/20 p-4"
          aria-live="polite"
        >
          <p className="mb-3 font-bold">{t('apiKeyOnce')}</p>
          <code className="block break-all select-all text-sm">
            {secret.value}
          </code>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={handleCopy}>
              {t(copied ? 'apiKeyCopied' : 'apiKeyCopy')}
            </Button>
            <Button variant="neutral" onClick={() => setSecret(null)}>
              {t('apiKeyDismiss')}
            </Button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-4 font-bold text-rose-700" role="alert">
          {error}
        </p>
      )}
      <div className="my-5 flex justify-end">
        <Button
          variant="neutral"
          size="sm"
          disabled={pending}
          onClick={handleRefresh}
        >
          {t('apiKeyRefresh')}
        </Button>
      </div>
      {keys === null ? (
        <p role="alert">{t('apiKeyLoadError')}</p>
      ) : keys.length === 0 ? (
        <p>{t('apiKeyEmpty')}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {keys.map((key) => (
            <li
              key={key.id}
              className="flex flex-col justify-between gap-4 border-t-2 border-black pt-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <p className="break-words font-black">{key.name}</p>
                <code className="text-sm">{key.prefix}…</code>
                <p className="text-sm">
                  {t('apiKeyCreated')}:{' '}
                  <time dateTime={key.createdAt}>
                    {key.createdAt.slice(0, 10)}
                  </time>
                </p>
                <p className="text-sm">
                  {t('apiKeyLastUsed')}:{' '}
                  {key.lastUsedAt ? (
                    <time dateTime={key.lastUsedAt}>
                      {key.lastUsedAt.replace('T', ' ').slice(0, 16)} UTC
                    </time>
                  ) : (
                    t('apiKeyNever')
                  )}
                </p>
              </div>
              {key.revokedAt ? (
                <span className="font-bold">{t('apiKeyRevoked')}</span>
              ) : (
                <Button
                  variant="destructive"
                  disabled={pending}
                  onClick={() => handleRevoke(key.id)}
                >
                  {t('apiKeyRevoke')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </details>
  )
}
