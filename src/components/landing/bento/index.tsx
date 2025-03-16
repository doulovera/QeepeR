import { Card } from '@/components/shared/card'
import theImage from './scanning-qr-illustration.jpeg'
import Image from 'next/image'

export function Bento() {
  return (
    <section>
      <div className="flex justify-between mb-5">
        <h2 className="text-4xl font-semibold">Your editable QRs</h2>
      </div>

      <section className="grid gap-4 mb-20 lg:grid-cols-2 lg:grid-rows-2">
        <div className="row-span-2 col-span-1 flex flex-col [&>article]:h-full aspect-square">
          <Card as="article" background="bg-[#5bbdae]">
            <div className="flex flex-col h-full w-full justify-center items-center text-center p-2">
              <Image
                src={theImage}
                alt="Hand holding phone scanning a QR code"
                width={350}
                className="mx-auto rounded-lg object-cover w-[300px] aspect-square"
              />
            </div>
          </Card>
        </div>

        <div className="row-span-2 flex flex-col justify-between gap-4 [&>article]:h-full">
          <Card as="article">
            <div className="flex flex-col w-full h-full text-center justify-center p-2">
              <h3 className="text-2xl">📎 Edit the destination URL</h3>
            </div>
          </Card>

          <Card as="article">
            <div className="flex flex-col w-full h-full text-center justify-center p-2">
              <h3 className="text-2xl">📤 Share to anyone!</h3>
            </div>
          </Card>
        </div>
      </section>
    </section>
  )
}
