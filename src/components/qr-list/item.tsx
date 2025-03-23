import type { ClientIQRS } from '@/data/models/IQRs'
import { Card } from '../shared/card'
import { QrImage } from '../shared/qr-image'
import { Accordion } from '../shared/accordion'
import { EditForm } from './form/edit-form'
import { DownloadButton } from '../landing/hero/download-button'

type Props = ClientIQRS

export function Item({
  alias,
  createdAt,
  destinationUrl,
  disabled,
  userId,
  views,
  svg,
}: Props) {
  return (
    <Card
      as="article"
      background={disabled ? 'bg-yellow-100' : 'bg-yellow-200'}
      shadow={false}
    >
      <div className="p-2 max-w-full w-full">
        <div
          className={`flex max-w-full justify-between mb-6 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} // TODO
        >
          <div className="flex flex-col justify-center gap-1 flex-grow min-w-0 overflow-hidden mr-4">
            <h3 className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              <a
                href={destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary-800 font-bold text-xl"
              >
                {destinationUrl}
              </a>
            </h3>

            <p>
              <span className="text-base font-bold">Views:</span> {views ?? 0}
            </p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0 w-[120px]">
            <QrImage svg={svg} />

            <DownloadButton svg={svg} disabled={disabled} size="small" />
          </div>
        </div>

        <Accordion title="Show Details">
          <EditForm
            id={alias}
            destinationUrl={destinationUrl}
            disabled={disabled}
          />
        </Accordion>

        <p className="text-xs font-mono text-left mt-5">
          <span className="font-bold">Alias:</span>{' '}
          <span className="">{alias}</span>
        </p>
      </div>
    </Card>
  )
}
