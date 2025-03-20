'use client'

import { useState } from 'react'

import { QrImage } from '@/components/shared/qr-image'

import { QrGenerationForm } from './qr-form'
import { Card } from '@/components/shared/card'
import { DownloadButton } from './download-button'
import { Button } from '@/components/shared/button'
import { Accordion } from '@/components/shared/accordion'
import { useScreen } from '@/hook/use-screen'

interface Props {
  isUserLogged: boolean
  defaultDynamicSwitch?: boolean
  hideable?: boolean
}

export function Generate({
  isUserLogged,
  defaultDynamicSwitch,
  hideable = false,
}: Props) {
  const [svg, setSvg] = useState<string | null>(null)

  const { atLeastSm } = useScreen()

  const canBeHidden = hideable && !atLeastSm

  return (
    <Card
      as={canBeHidden ? Accordion : 'section'}
      shadow={false}
      componentProps={(canBeHidden && { defaultOpen: false }) || {}}
    >
      <div className="py-4 px-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Generate a QR</h2>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_30%] items-center gap-12 w-full min-h-72">
          <QrGenerationForm
            setSvg={setSvg}
            isUserLogged={isUserLogged}
            defaultDynamicSwitch={defaultDynamicSwitch}
          />
          <div className="flex flex-col gap-4 justify-between h-full">
            <QrImage svg={svg || ''} />

            <DownloadButton svg={svg} />
          </div>
        </div>
      </div>
    </Card>
  )
}
