'use client'

import { useState } from 'react'

import { QrImage } from '@/components/shared/qr-image'

import { QrGenerationForm } from './qr-form'
import { Card } from '@/components/ui/card'
import { DownloadButton } from './download-button'
import { Button } from '@/components/ui/button'
import { Accordion } from '@/components/shared/accordion'
import { useScreen } from '@/hook/use-screen'
import { Download } from '@/components/icons/download'

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
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="pointer-events-none absolute -left-20 top-24 hidden h-40 w-20 bg-main sm:block" />
      <div className="pointer-events-none absolute -right-16 bottom-12 hidden h-36 w-20 border-2 border-black bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:20px_20px] lg:block" />
      <Card
        as={canBeHidden ? Accordion : 'section'}
        shadow={false}
        weight="normal"
        className="relative rounded-none bg-white p-0 shadow-[16px_16px_0_#000]"
        componentProps={(canBeHidden && { defaultOpen: false }) || {}}
      >
        <div className="px-5 py-6 sm:px-9 sm:py-7 lg:px-12">
          <div className="grid min-h-72 w-full grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_1px_32%] lg:gap-8">
            <div className="max-w-[34rem]">
              <h2 className="mb-2 text-4xl font-black uppercase leading-none sm:text-[2.5rem]">
                Generate a QR
              </h2>
              <div className="mb-6 h-1 w-full bg-black" />
              <QrGenerationForm
                setSvg={setSvg}
                isUserLogged={isUserLogged}
                defaultDynamicSwitch={defaultDynamicSwitch}
              />
            </div>
            <div className="hidden bg-black lg:block" />
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-black uppercase">QR Preview</h3>
              </div>
              <div className="overflow-hidden border-4 border-black">
                <QrImage
                  svg={svg || ''}
                  className="rounded-none border-0 p-0"
                />
                <p className="bg-black px-3 py-2 text-center text-sm font-black text-white sm:text-base">
                  Your QR code will appear here
                </p>
              </div>

              <DownloadButton
                svg={svg}
                className="h-16 rounded-none border-4 text-xl font-black uppercase shadow-[8px_8px_0_#000] sm:text-2xl"
                icon={<Download className="size-8" />}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
