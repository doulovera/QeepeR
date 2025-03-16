import { useState } from 'react'
import { API_BASE_URL } from '@/constants/app'
/* actions */
import { createDynamicQR } from '@/data/actions/dynamic-code-actions'
/* components */
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input'
import { Switch } from '@/components/shared/switch'
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
      className="flex-1 flex flex-col gap-6 sm:gap-14"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input name="url" label="Destination URL" required />

        <div title={isDynamicQrDisabled ? 'You need to login' : undefined}>
          <Switch
            label="DynamicQR"
            disabled={isDynamicQrDisabled}
            name="is_dynamic"
            checked={defaultDynamicSwitch}
          />
        </div>
      </div>
      <div>
        <Button type="submit" disabled={!API_BASE_URL}>
          <span className="flex gap-2 px-5">Generate</span>
        </Button>
      </div>
    </form>
  )
}
