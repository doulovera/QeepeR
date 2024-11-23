import { Generate } from "./generate";

export function Hero() {
  return (
    <section className="flex flex-col gap-10 my-14 sm:mt-20 sm:mb-32">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-6xl font-semibold">
          Generate & <span className="bg-purple-300">Edit</span>
        </h1>

        <p className="max-w-[40ch] mx-auto font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta numquam vitae, minus beatae eaque officia alias.          
        </p>
      </div>
      <Generate />
    </section>
  )
}