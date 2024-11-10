import { useState } from "react"
import { API_BASE_URL } from "@/constants/app";
/* actions */
import { createQR } from "@/data/actions/create-qr-actions";
import { createPermaQR } from "@/data/actions/perma-code-actions";
/* components */
import { LightningBolt } from "@/components/icons/lightning-bolt";
import { Qr } from "@/components/icons/qr";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";

export function QrGenerationForm({ setSvg }: { setSvg: (svg: string | null) => void }) {
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