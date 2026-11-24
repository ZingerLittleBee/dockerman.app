import { cx } from '@repo/shared/utils'
import Image from 'next/image'
import type { LogoFit } from '@/components/home/data'

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
