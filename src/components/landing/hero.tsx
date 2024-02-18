'use client'

import { useState } from "react";
import { LightningBolt } from "../icons/lightning-bolt";
import { Qr } from "../icons/qr";
import { Button } from "../shared/button";
import { Input } from "../shared/input";
import { QrImage } from "../shared/qr-image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

const QrGenerationForm = ({ setSvg }: { setSvg: (svg: string | null) => void }) => {

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.currentTarget
    const url = form.url.value

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })

    const data = await res.json()
    setSvg(data.svg)
  }

  return (
    <form className="flex-1 flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold">Generate a QR</h1>
      <Input
        name="url"
        label="Destination URL"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={!API_BASE_URL}>
          <span className="flex gap-2">
            Generate <Qr width={20} color="#fff" />
          </span>
        </Button>

        <Button title="You need to login" disabled>
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
        {
          svg && ( // TODO: avoid layout shift when appearing
            <Button>
              Save
            </Button>
          )
        }
      </div>
    </section>
  );
}