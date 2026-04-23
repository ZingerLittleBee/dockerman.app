import type { ReactNode } from 'react'

export interface PlanCardProps {
  name: string
  price: ReactNode
  priceSuffix?: string
  strikePrice?: string
  tagline: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  highlight?: boolean
  highlightLabel?: string
}

export function PlanCard(p: PlanCardProps) {
  return (
    <article
      className={`relative flex flex-col rounded-[16px] border p-6 ${
        p.highlight
          ? 'border-transparent bg-dm-bg-elev shadow-[0_0_0_1.5px_var(--color-dm-accent-2),0_30px_60px_-20px_var(--color-dm-accent-2)]'
          : 'border-dm-line bg-dm-bg-elev'
      }`}
    >
      {p.highlight && p.highlightLabel && (
        <span
          className="-top-3 absolute left-6 rounded-full border border-dm-line-strong bg-dm-ink px-3 py-[3px] font-semibold font-[var(--font-dm-mono)] text-[11px] text-dm-bg tracking-wide"
        >
          {p.highlightLabel}
        </span>
      )}
      <div className="text-[13px] text-dm-ink-3">{p.name}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-bold font-[var(--font-dm-mono)] text-[48px] text-dm-ink leading-none tracking-[-0.03em]">
          {p.price}
        </div>
        {p.priceSuffix && <div className="text-[13px] text-dm-ink-3">{p.priceSuffix}</div>}
        {p.strikePrice && (
          <div className="text-[13px] text-dm-ink-4 line-through">{p.strikePrice}</div>
        )}
      </div>
      <p className="mt-2 text-[13px] text-dm-ink-2">{p.tagline}</p>
      <ul className="mt-6 flex-1 space-y-3 text-[14px] text-dm-ink-2">
        {p.features.map((f) => (
          <li className="flex items-start gap-2" key={f}>
            <span
              className="mt-[6px] h-[6px] w-[6px] rounded-full"
              style={{ background: 'var(--color-dm-accent)' }}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        className={`mt-8 block rounded-lg px-4 py-[10px] text-center font-medium text-[14px] ${
          p.highlight
            ? 'bg-dm-ink text-dm-bg'
            : 'border border-dm-line-strong text-dm-ink hover:bg-dm-bg-soft'
        }`}
        href={p.ctaHref}
      >
        {p.ctaLabel}
      </a>
    </article>
  )
}
