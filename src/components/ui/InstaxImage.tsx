"use client"
import { cx } from "@/lib/utils"
import Image from "next/image"

export function InstaxImage({
  className,
  src,
  width,
  height,
  alt,
  caption,
}: {
  className?: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
}) {
  return (
    <figure
      className={cx(
        "h-fit overflow-hidden rounded-lg bg-white shadow-xl shadow-black/10 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-black/20 dark:bg-gray-900 dark:shadow-indigo-500/5 dark:ring-white/20 dark:hover:shadow-indigo-900/20",
        className,
      )}
    >
      <div className="bg-gray-50 p-2 dark:bg-gray-900">
        <div className="relative overflow-hidden rounded">
          <div className="absolute inset-0 shadow-[inset_0px_0px_3px_0px_rgb(0,0,0,1)]"></div>
          <Image src={src} alt={alt} width={width} height={height} />
        </div>
      </div>
      <div
        className={cx(
          "px-2 pb-2 pt-2 font-handwriting text-xl text-gray-700 dark:text-gray-300",
        )}
      >
        <figcaption className="text-center">{caption}</figcaption>
      </div>
    </figure>
  )
}
