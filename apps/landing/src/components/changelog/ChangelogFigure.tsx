import Image from 'next/image'

export function ChangelogFigure({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-[10px] border border-dm-line">
      <Image alt={caption} className="h-auto w-full" height={720} src={src} width={1200} />
      <figcaption className="border-dm-line border-t bg-dm-bg-soft px-3 py-2 text-[12px] text-dm-ink-3">
        {caption}
      </figcaption>
    </figure>
  )
}
