'use server'

import { getUserMe } from '@/data/services/get-user-me-service'

import { Generate } from './generate'

export async function Hero() {
  const user = await getUserMe()

  return (
    <section className="flex flex-col gap-10 mb-14 sm:mb-32">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-6xl font-semibold">
          Generate & <span className="bg-purple-300">Edit</span>
        </h1>

        <p className="max-w-[45ch] mx-auto text-lg">
          Quickly generate static or dynamic QR codes, personalize their design,
          and update their destinations at any time.
        </p>

        {/* <p className="text-balance">
        Whether you’re sharing a website, promoting an event, or tracking product information,
        QeepeR makes it simple to engage your audience and keep your content fresh.
        </p> */}
      </div>
      <Generate isUserLogged={!!user?.uid} />
    </section>
  )
}
