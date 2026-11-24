import { cx } from '@repo/shared/utils'
import Image from 'next/image'
import { ENGINES, type LogoFit } from '@/components/home/data'

/** Image size per fit, matching the home page's light logo tiles. */
const FIT_IMAGE: Record<LogoFit, string> = {
  pad: 'size-[64%]',
  full: 'size-full',
  large: 'size-[94%]'
}

/** Engine logo on a light rounded tile; the caller sets the tile size and radius. */
export function EngineLogo({
  src,
  fit,
  className
}: {
  src: string
  fit: LogoFit
  className?: string
}) {
  return (
    <span
      className={cx(
        'grid shrink-0 place-items-center overflow-hidden',
        fit !== 'full' && 'bg-[#f4f4f2] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]',
        className
      )}
    >
      <Image
        alt=""
        className={cx('block object-contain', FIT_IMAGE[fit])}
        height={64}
        src={src}
        unoptimized
        width={64}
      />
    </span>
  )
}

/** Overlapping logos of every engine Dockerman can drive; decorative, the text beside it names them. */
export function EngineStack({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cx('flex -space-x-1.5', className)}>
      {ENGINES.map((engine) => (
        <EngineLogo
          className="size-5 rounded-full ring-2 ring-dm-bg-elev sm:size-6"
          fit={engine.fit}
          key={engine.name}
          src={engine.logo}
        />
      ))}
    </span>
  )
}
