import { downloadsConfig, type InstallerAsset, type Verification } from '@/config/downloads'

export interface PlatformStrings {
  recommended: string
  appleNotarized: string
  tauriSig: string
}

function verificationLabel(v: Verification, strings: PlatformStrings): string | null {
  switch (v.kind) {
    case 'apple-notarized':
      return strings.appleNotarized
    case 'tauri-sig':
      return strings.tauriSig
    case 'none':
      return null
    default: {
      const _exhaustive: never = v
      return _exhaustive
    }
  }
}

export interface PlatformCardProps {
  title: string
  minSpec: string
  assets: InstallerAsset[]
  icon: React.ReactNode
  strings: PlatformStrings
  featured?: boolean
  footLinks?: { label: string; href: string }[]
}

export function PlatformCard({
  title,
  minSpec,
  assets,
  icon,
  featured,
  footLinks,
  strings
}: PlatformCardProps) {
  return (
    <article
      className="relative flex flex-col gap-[18px] overflow-hidden rounded-[14px] border p-6 transition-all hover:-translate-y-px"
      style={
        featured
          ? {
              borderColor:
                'color-mix(in srgb, var(--color-dm-accent-2) 30%, var(--color-dm-line-strong))',
              backgroundImage:
                'radial-gradient(ellipse at top right, color-mix(in srgb, var(--color-dm-accent-2) 10%, transparent), transparent 55%)',
              backgroundColor: 'var(--color-dm-bg-elev)',
              boxShadow:
                '0 20px 50px -20px color-mix(in srgb, var(--color-dm-accent-2) 25%, transparent)'
            }
          : { borderColor: 'var(--color-dm-line)', backgroundColor: 'var(--color-dm-bg-elev)' }
      }
    >
      <div className="flex items-center gap-[14px]">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-[12px] border border-dm-line bg-dm-bg-soft text-dm-ink">
          {icon}
        </div>
        <div>
          <div className="font-bold text-[20px] text-dm-ink tracking-[-0.02em]">{title}</div>
          <div className="mt-[2px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
            {minSpec}
          </div>
        </div>
        {featured ? (
          <span
            className="ml-auto rounded-full px-2 py-[3px] font-[var(--font-dm-mono)] font-semibold text-[10.5px] uppercase tracking-[0.02em]"
            style={{
              background: 'color-mix(in srgb, var(--color-dm-accent-2) 14%, transparent)',
              color: 'var(--color-dm-accent-2)'
            }}
          >
            {strings.recommended}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {assets.map((a) => {
          const vLabel = verificationLabel(a.verification, strings)
          return (
            <a
              className="group relative flex items-center gap-3 rounded-[10px] border border-dm-line bg-dm-bg px-[14px] py-3 text-dm-ink no-underline transition-all hover:translate-x-[2px] hover:border-[color:color-mix(in_srgb,var(--color-dm-accent-2)_40%,var(--color-dm-line-strong))] hover:bg-dm-bg-elev"
              download
              href={`${downloadsConfig.assetsBaseUrl}/${a.filename}`}
              key={a.filename}
            >
              <svg
                className="flex-shrink-0 text-dm-ink-3 transition-colors group-hover:translate-y-[1px] group-hover:text-[var(--color-dm-accent-2)]"
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[13.5px] tracking-[-0.005em]">{a.label}</div>
                <div className="mt-[2px] truncate font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4">
                  {a.filename}
                  {vLabel ? ` · ${vLabel}` : ''}
                </div>
              </div>
              <span className="flex-shrink-0 whitespace-nowrap rounded bg-dm-bg-soft px-[7px] py-[3px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-3">
                {a.size}
              </span>
            </a>
          )
        })}
      </div>

      {footLinks && footLinks.length > 0 ? (
        <div className="mt-auto flex gap-[14px] pt-[6px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
          {footLinks.map((l) => (
            <a
              className="border-b border-dashed text-dm-ink-3 no-underline hover:text-dm-ink"
              href={l.href}
              key={l.label}
              rel="noopener noreferrer"
              style={{ borderBottomColor: 'var(--color-dm-line-strong)' }}
              target="_blank"
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}
