import { cx } from '@repo/shared/utils'

/** Mono `// kicker`, a two-part title with a dimmed accent, and an optional one-line lede. */
export function SectionHeading({
  kicker,
  lead,
  accent,
  description,
  cjk,
  className
}: {
  kicker: string
  lead: string
  accent: string
  description?: string
  cjk: boolean
  className?: string
}) {
  return (
    <div className={cx('max-w-[640px]', className)}>
      <div className="font-[var(--font-dm-mono)] text-[12px] text-dm-accent tracking-[0.04em]">
        <span aria-hidden="true" className="text-dm-ink-4 before:content-['//_']" />
        {kicker}
      </div>
      <h2
        className={cx(
          'mx-0 mt-[10px] mb-0 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink',
          cjk ? 'leading-[1.2] tracking-normal' : 'leading-[1.05] tracking-[-0.03em]'
        )}
      >
        {lead}
        {cjk ? '' : ' '}
        <em
          className={
            cjk
              ? 'font-normal text-dm-ink-3 not-italic'
              : 'font-[var(--font-dm-display)] font-normal text-dm-ink-3 italic'
          }
        >
          {accent}
        </em>
      </h2>
      {description ? (
        <p className="mt-3 mb-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">{description}</p>
      ) : null}
    </div>
  )
}
