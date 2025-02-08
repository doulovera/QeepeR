import type { ClientIQRS } from '@/data/models/IQRs'
import { Card } from '../shared/card'
import { QrImage } from '../shared/qr-image'
import { Accordion } from '../shared/accordion'
import { EditForm } from './form/edit-form'

type Props = ClientIQRS

export function Item({
  alias,
  createdAt,
  destinationUrl,
  disabled,
  userId,
  views,
}: Props) {
  const svg = ''
  return (
    <Card
      as="article"
      background={disabled ? 'bg-yellow-100' : 'bg-yellow-200'}
    >
      <div
        className={`flex h-32 justify-between mb-6 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} // TODO
      >
        <div className="flex flex-col justify-center gap-1 w-1/2">
          <h3>
            <a
              href={destinationUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 font-bold"
            >
              {destinationUrl}
            </a>
          </h3>

          <p>
            <span className="text-base font-bold">Views:</span> {views ?? 0}
          </p>
        </div>
        <div className="flex justify-end w-full">
          <QrImage svg={svg} />
        </div>
      </div>
      <Accordion
        title="Show Details"
      >
        <EditForm
          id={alias}
          destinationUrl={destinationUrl}
          disabled={disabled}
        />
      </Accordion>
    </Card>
  )
}
