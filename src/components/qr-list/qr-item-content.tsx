'use client'

import type { QrInfoResponse } from "./qr-item"

import { CircleLeftArrow } from "@/components/icons/circle-left-arrow"
import { CircleRightArrow } from "@/components/icons/circle-right-arrow"
import Link from "next/link";

import { Input } from "@/components/shared/input"
import { QrImage } from "@/components/shared/qr-image"
import { ActionButtons } from "./action-buttons"
import { EditForm } from "./form/edit-form"

import { Eye } from "@/components/icons/eye"
import { ClipboardCopy } from "@/components/icons/clipboard-copy"

export const QrItemContent = (
  { id, image, destinationUrl, disabled, visitorsCount, page, length, previous, next }: 
  QrInfoResponse & { visitorsCount: number }
) => {

  return (
    <>
      <div className="flex justify-around items-center gap-10 mb-10">
        <Link
          className={`${previous ? '' : 'opacity-60'}`}
          // onClick={() => loadNewQr(previous!)}
          href={`/qr/${previous}`}
          prefetch={false}
        >
          <CircleLeftArrow width={30} color="#fff" />
        </Link>
        <h2 className="text-xl font-bold">
          {page}/{length}
        </h2>
        <Link
          className={`${next ? '' : 'opacity-60'}`}
          // onClick={() => loadNewQr(next!)}
          href={`/qr/${next}`}
          prefetch={false}
        >
          <CircleRightArrow width={30} color="#fff" />
        </Link>
      </div>
      <article className="flex flex-col justify-center gap-8 w-full max-w-2xl ">
        <QrImage svg={image} />
      
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
    </>
  )
}
