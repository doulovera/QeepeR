import { Input } from "../shared/input"
import { Switch } from "../shared/switch"

export const QrItem = () => {
  return (
    <article className="flex flex-col justify-center gap-8 w-full max-w-2xl ">
      <div className="h-60 w-60 bg-white rounded-md mx-auto">
        {/* image */}
      </div>

      <section className="flex flex-col gap-2 w-full h-auto rounded-3xl overflow-hidden">
        <div className="flex-1 flex flex-col gap-3 min-h-[20rem] p-6 bg-primary-950 rounded-b-[2.5px] rounded-t-3xl">
          
          <div className="flex justify-between gap-20">
            <Input
              label="Background Color"
            />
            <Input
              label="Squares Color"
            />
          </div>
          
          <div className="w-full">
            <Input
              label="Destination URL"
            />
          </div>

          <div className="flex justify-between items-center gap-20">
            <Switch
              label="Disable Link"
              description="If enabled, the QR will show a 404 page"
            />
            <Switch
              label="Visitors Count"
              description="Keep track of the amount of people that visits your QR"
            />
          </div>

          <div className="flex justify-between">
            <Input
              label="Shortened URL"
              disabled
            />
            <p className="w-full">
              13 views
            </p>
          </div>

        </div>
        <div className="flex justify-between gap-2">
          <button className="bg-primary-950 w-full h-14 rounded-[2.5px]">Delete</button>
          <button className="bg-primary-950 w-full h-14 rounded-[2.5px]">Download</button>
          <button className="bg-primary-950 w-full h-14 rounded-[2.5px]">Share</button>
        </div>
      </section>
    </article>
  )
}