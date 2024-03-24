import { ActionButtons } from "./action-buttons"

import { Input } from "../shared/input"
import { QrImage } from "../shared/qr-image"
import { Switch } from "../shared/switch"

import { Eye } from "../icons/eye"
import { EditForm } from "./edit-form"
import { ClipboardCopy } from "../icons/clipboard-copy"

export const QrItem = (
  { svg, id, disabled, destinationUrl }:
  {
    svg: string;
    id: string;
    disabled: boolean;
    destinationUrl: string;
  }
) => {
  const visitorsCount = 0

  return (
    <article className="flex flex-col justify-center gap-8 w-full max-w-2xl ">
      <QrImage svg={svg} />

      <section className="flex flex-col gap-2 w-full h-auto rounded-3xl overflow-hidden">
        <div className="flex-1 flex flex-col gap-1 min-h-[20rem] p-6 bg-primary-950 rounded-b-[2.5px] rounded-t-3xl">
          <EditForm
            id={id}
            destinationUrl={destinationUrl}
            disabled={disabled}
          />

          <div className="flex gap-20 justify-between">
            <Input
              label="QR ID"
              // description="This id is used to access the QR code from the URL"
              // value={`${API_BASE_URL}/${id}`}
              value={`${id}`}
              iconBtn={ <ClipboardCopy width="20" color="#fff" /> }
              disabled
            />
            <div className="w-full my-5">
              <span className="block text-primary-50 mb-2 text-sm font-bold">
                Visitors Count
              </span>

              <div className="flex items-center justify-start gap-2 py-2 text-2xl font-bold">
                {
                  visitorsCount
                    ? (
                      <>
                        <Eye width={40} color="#fff" />
                        <p className="w-full">
                          {visitorsCount} views
                        </p>
                      </>
                    )
                    : <p>Disabled</p>
                }
              </div>
            </div>
          </div>

        </div>
        <ActionButtons
          handleDelete={() => console.log('delete')}
        />
      </section>
    </article>
  )
}