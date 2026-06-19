import { useState } from 'react'
import { API_BASE_URL } from '@/constants/app'
/* actions */
import { createDynamicQR } from '@/data/actions/dynamic-code-actions'
/* components */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { LightningBolt } from '@/components/icons/lightning-bolt'
import { Qr } from '@/components/icons/qr'
import { generateQr } from '@/utils/generate-qr'

interface Props {
  setSvg: (svg: string | null) => void
  isUserLogged: boolean
  defaultDynamicSwitch?: boolean
}

export function QrGenerationForm({
  setSvg,
  isUserLogged,
  defaultDynamicSwitch,
}: Props) {
  const isDynamicQrDisabled = !isUserLogged

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.currentTarget
    const { value } = form.url
    const { checked: isDynamic } = form.is_dynamic

    if (!value) return
    // TODO: Check the value is a valid URL

    if (!isDynamic) {
      const svg = await generateQr(value)
      setSvg(svg)
    } else {
      if (!isUserLogged) return
      const data = await createDynamicQR(value)
      if (!data) return
      setSvg(data)
    }
  }

  return (
    <form
      className="flex flex-1 flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2" htmlFor="landing-url">
          <span className="text-sm font-black uppercase sm:text-base">
            Destination URL
          </span>
          <span className="relative">
            <Input
              id="landing-url"
              name="url"
              placeholder="https://your-website.com"
              required
              className="h-14 rounded-none border-4 px-5 pl-14 text-base font-bold shadow-none placeholder:text-black/35"
            />
            <span className="pointer-events-none absolute left-5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-black">
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                <path
                  d="M10.5 13.5 13.5 10.5M8.5 12.5 6.9 14.1a3.6 3.6 0 1 0 5.1 5.1l2.2-2.2a3.6 3.6 0 0 0 0-5.1M15.5 11.5l1.6-1.6A3.6 3.6 0 1 0 12 4.8L9.8 7a3.6 3.6 0 0 0 0 5.1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </span>
          </span>
        </label>

        <div className="flex items-center gap-3 bg-main/20 px-4 py-2.5 text-xs font-bold sm:text-sm">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-black font-black">
            i
          </span>
          <span>Enter the URL or link you want your QR code to open.</span>
        </div>

        <div title={isDynamicQrDisabled ? 'You need to login' : undefined}>
          <p className="mb-2 text-sm font-black uppercase sm:text-base">
            Dynamic QR
          </p>
          <Switch
            label="DynamicQR"
            disabled={isDynamicQrDisabled}
            name="is_dynamic"
            checked={defaultDynamicSwitch}
          />
        </div>

        <div className="flex max-w-md items-center gap-3 border-2 border-dashed border-black px-4 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center bg-main">
            <LightningBolt className="size-5" />
          </span>
          <p className="text-xs font-bold leading-5 sm:text-sm">
            Dynamic QR lets you update the destination link anytime without
            reprinting.
          </p>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          disabled={!API_BASE_URL}
          className="h-16 w-full max-w-md rounded-none border-4 text-2xl font-black uppercase shadow-[8px_8px_0_#000] sm:text-3xl"
        >
          <Qr className="size-8" />
          <span className="flex flex-1 justify-center px-3">Generate</span>
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Button>
      </div>
    </form>
  )
}
