import { Delete } from "../icons/delete"
import { Download } from "../icons/download"
import { Eye } from "../icons/eye"
import { Share } from "../icons/share"
import { Input } from "../shared/input"
import { QrImage } from "../shared/qr-image"
import { Switch } from "../shared/switch"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

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
          
          <div className="flex justify-between gap-20">
            <Input
              label="Background Color"
              disabled
            />
            <Input
              label="Squares Color"
              disabled
            />
          </div>
          
          <div className="w-full">
            <Input
              label="Destination URL"
              description="The link you want it to redirect"
              value={destinationUrl}
              onChange={() => console.log('change')}
            />
          </div>

          <div className="flex justify-between items-center gap-20">
            <Switch
              label="Disable Link"
              description="If enabled, the QR will show a 404 page"
              checked={disabled}
            />
            <Switch
              label="Visitors Count"
              description="Keep track of the amount of people that visits your QR"
              disabled
            />
          </div>

          <div className="flex gap-20 justify-between">
            <Input
              label="Shortened URL"
              value={`${API_BASE_URL}/${id}`}
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
        <div className="flex justify-between gap-2">
          <button className="flex items-center justify-center gap-2 w-full h-14 rounded-[2.5px] bg-primary-950">
            <Delete width="20" color="#fff" />
            Delete
          </button>
          <button className="flex items-center justify-center gap-2 w-full h-14 rounded-[2.5px] bg-primary-950">
            <Download width="20" color="#fff" />
            Download
          </button>
          <button className="flex items-center justify-center gap-2 w-full h-14 rounded-[2.5px] bg-primary-950">
            <Share width="20" color="#fff" />
            Share
          </button>
        </div>
      </section>
    </article>
  )
}