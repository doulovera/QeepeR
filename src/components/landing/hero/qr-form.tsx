import { useState } from 'react'
import { API_BASE_URL } from '@/constants/app'
/* actions */
import { createQR } from '@/data/actions/create-qr-actions'
import { createPermaQR } from '@/data/actions/perma-code-actions'
/* components */
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input'
import { Switch } from '@/components/shared/switch'

interface Props {
  setSvg: (svg: string | null) => void
  isUserLogged: boolean
}

export function QrGenerationForm({ setSvg, isUserLogged }: Props) {
  const [destinationUrl, setDestinationUrl] = useState<string>('')

  const isPermaQrDisabled = !isUserLogged

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.currentTarget
    const { value } = form.url

    if (!value) return
    const data = await createQR({ url: value })
    if (!data.success) return

    setSvg(data.svg)
  }

  const handlePermaQr = async () => {
    if (!isUserLogged || !destinationUrl) return
    const data = await createPermaQR(destinationUrl)
    if (!data) return
    setSvg(data)
  }

  return (
    <form className="flex-1 flex flex-col gap-5" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold">Generate a QR</h2>

      <div className="flex flex-col gap-6">
        <Input
          name="url"
          label="Destination URL"
          onChange={(evt) => setDestinationUrl(evt.target.value)}
          required
        />

        <div title={isPermaQrDisabled ? 'You need to login' : undefined}>
          <Switch label="PermaQR" disabled={isPermaQrDisabled} />
        </div>

        <div>
          <Button type="submit" disabled={!API_BASE_URL}>
            <span className="flex gap-2 px-5">Generate</span>
          </Button>

          {/* <Button
            type="button"
            title={isPermaQrDisabled ? 'You need to login' : undefined}
            disabled={isPermaQrDisabled}
            onClick={handlePermaQr}
          >
            <span className="flex gap-2 px-5">PermaQR</span>
          </Button> */}
        </div>
      </div>
    </form>
  )
}
