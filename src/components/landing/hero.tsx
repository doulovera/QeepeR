'use client'

import { useState } from "react";

import { API_BASE_URL } from "@/constants/app";
import { createQR } from "@/data/actions/create-qr-actions";

import { LightningBolt } from "../icons/lightning-bolt";
import { Qr } from "../icons/qr";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { QrImage } from "@/components/shared/qr-image";
import { createPermaQR } from "@/data/actions/perma-code-actions";

const QrGenerationForm = ({ setSvg }: { setSvg: (svg: string | null) => void }) => {
  const [destinationUrl, setDestinationUrl] = useState<string>('')

  const permaQrDisabled = true

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.currentTarget
    const url = form.url.value

    const data = await createQR({ url })
    if (!data.success) return

    setSvg(data.svg)
  }

  const handlePermaQr = async () => {
    const data = await createPermaQR(destinationUrl)
    if (!data) return
    setSvg(data)
  }

  return (
    <form className="flex-1 flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold">Generate a QR</h1>
      <Input
        name="url"
        label="Destination URL"
        onChange={(evt) => setDestinationUrl(evt.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={!API_BASE_URL}>
          <span className="flex gap-2">
            Generate <Qr width={20} color="#fff" />
          </span>
        </Button>

        <Button
          type="button"
          title={permaQrDisabled ? "You need to login" : undefined}
          disabled={permaQrDisabled}
          onClick={handlePermaQr}
        >
          <span className="flex gap-2">
            PermaQR <LightningBolt width={20} color="#fff" />
          </span>
        </Button>
      </div>
    </form>
  )
}

export const Hero = () => {
  const [svg, setSvg] = useState<string | null>(null)
  return (
    <section className="flex items-center justify-between gap-20 w-full h-96">
      <QrGenerationForm
        setSvg={setSvg}
      />
      <div className="flex flex-col justify-center gap-2">
        <QrImage svg={svg || ''} size="large" />
        <Button
          className={`${svg ? 'inline-block' : 'invisible'}`}
          onClick={() => {
            if (svg) {
              const blob = new Blob([svg], { type: 'image/svg+xml' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'qr-code.svg'
              a.click()
              URL.revokeObjectURL(url)
            }
          }}
        >
          Save
        </Button>
      </div>
    </section>
  );
}