import type { ReactNode } from 'react'

export interface PlanFeature {
  label: ReactNode
  included?: boolean
}

export interface PlanCardProps {
  label: string
  name: ReactNode
  description: string
  price: number | string
  strikePrice?: string
  freq: string
  features: PlanFeature[]
  ctaLabel: string
  ctaHref: string
  ctaTarget?: '_blank' | '_self'
  ctaVariant?: 'primary' | 'ghost' | 'disabled'
  ctaNote?: string
  highlighted?: boolean
  ribbon?: string
}

export function PlanCard(p: PlanCardProps) {
  const {
    label,
    name,
    description,
    price,
    strikePrice,
    freq,
    features,
    ctaLabel,
    ctaHref,
    ctaTarget,
    ctaVariant = 'ghost',
    ctaNote,
    highlighted,
    ribbon
  } = p

  return (
    <article
      className={
        highlighted
          ? 'relative flex flex-col rounded-[16px] border p-8'
          : 'flex flex-col rounded-[16px] border border-dm-line bg-dm-bg-elev p-8'
      }
      style={
        highlighted
          ? {
              borderColor:
                'color-mix(in srgb, var(--color-dm-accent-2) 40%, var(--color-dm-line-strong))',
              backgroundImage:
                'radial-gradient(ellipse at top, color-mix(in srgb, var(--color-dm-accent-2) 10%, transparent), transparent 55%)',
              backgroundColor: 'var(--color-dm-bg-elev)',
              boxShadow:
                '0 25px 60px -25px color-mix(in srgb, var(--color-dm-accent-2) 40%, transparent)',
              transform: 'translateY(-6px)'
            }
          : undefined
      }
    >
      {ribbon ? (
        <span
          className="absolute top-[18px] right-[18px] rounded-full px-[10px] py-1 font-[var(--font-dm-mono)] font-bold text-[10.5px] text-white uppercase tracking-[0.04em]"
          style={{
            background: 'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
            boxShadow:
              '0 8px 20px -6px color-mix(in srgb, var(--color-dm-accent-2) 50%, transparent)'
          }}
        >
          {ribbon}
        </span>
      ) : null}

      <div className="font-[var(--font-dm-mono)] font-semibold text-[11px] text-dm-ink-3 uppercase tracking-[0.1em]">
        {label}
      </div>
      <div className="mt-[10px] font-bold text-[26px] tracking-[-0.025em]">{name}</div>
      <div className="mt-[6px] min-h-[38px] text-[13px] text-dm-ink-3 leading-[1.5]">
        {description}
      </div>

      <div className="mt-6 flex items-baseline gap-[10px] border-dm-line border-b pb-6">
        <div className="font-bold text-[56px] tabular-nums leading-none tracking-[-0.04em]">
          <span className="mr-[2px] align-top font-semibold text-[24px] text-dm-ink-3">$</span>
          {price}
        </div>
        {strikePrice ? (
          <div
            className="font-[var(--font-dm-mono)] text-[16px] text-dm-ink-4 line-through"
            style={{ textDecorationThickness: '1.5px' }}
          >
            {strikePrice}
          </div>
        ) : null}
        <div className="ml-auto font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3 tracking-[0.02em]">
          {freq}
        </div>
      </div>

      <ul className="m-0 mt-5 mb-7 flex list-none flex-col gap-[11px] p-0">
        {features.map((f, i) => {
          const muted = f.included === false
          return (
            <li
              className={`flex items-start gap-[10px] text-[13.5px] leading-[1.5] ${
                muted ? 'line-through' : ''
              }`}
              key={`${i}-${typeof f.label === 'string' ? f.label : ''}`}
              style={{
                color: muted ? 'var(--color-dm-ink-4)' : 'var(--color-dm-ink-2)',
                textDecorationThickness: muted ? '1px' : undefined,
                textDecorationColor: muted ? 'var(--color-dm-ink-4)' : undefined
              }}
            >
              <span
                aria-hidden="true"
                className="mt-[2px] grid h-4 w-4 flex-shrink-0 place-items-center rounded"
                style={{
                  background: muted
                    ? 'var(--color-dm-bg-soft)'
                    : 'color-mix(in srgb, var(--color-dm-ok) 14%, transparent)',
                  color: muted ? 'var(--color-dm-ink-4)' : 'var(--color-dm-ok)'
                }}
              >
                {muted ? (
                  <svg
                    fill="none"
                    height="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="10"
                  >
                    <line x1="6" x2="18" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="18" y2="6" />
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    height="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="10"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span>{f.label}</span>
            </li>
          )
        })}
      </ul>

      <a
        aria-disabled={ctaVariant === 'disabled' || undefined}
        className={`mt-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] px-[18px] py-[13px] font-semibold text-[14px] no-underline transition-all ${
          ctaVariant === 'primary'
            ? 'text-white hover:-translate-y-px'
            : ctaVariant === 'disabled'
              ? 'cursor-not-allowed border border-dm-line bg-dm-bg-soft text-dm-ink-3'
              : 'border border-dm-line-strong bg-transparent text-dm-ink hover:bg-dm-bg-soft'
        }`}
        href={ctaVariant === 'disabled' ? undefined : ctaHref}
        rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
        target={ctaVariant === 'disabled' ? undefined : ctaTarget}
        style={
          ctaVariant === 'primary'
            ? {
                background:
                  'linear-gradient(180deg, var(--color-dm-accent-2), color-mix(in srgb, var(--color-dm-accent-2) 80%, black))',
                borderColor: 'transparent',
                boxShadow:
                  '0 10px 24px -8px color-mix(in srgb, var(--color-dm-accent-2) 55%, transparent)'
              }
            : undefined
        }
      >
        {ctaVariant === 'primary' ? (
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        ) : null}
        {ctaLabel}
      </a>

      {ctaNote ? (
        <div className="mt-3 text-center font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
          {ctaNote}
        </div>
      ) : null}
    </article>
  )
}
