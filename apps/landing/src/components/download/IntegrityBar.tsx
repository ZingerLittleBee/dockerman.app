import { downloadsConfig } from '@/config/downloads'

export function IntegrityBar() {
  const { latest, updaterPublicKeyUrl } = downloadsConfig
  return (
    <section className="px-8">
      <div className="mx-auto mt-10 max-w-[1140px]">
        <div className="flex flex-wrap items-center gap-[18px] rounded-[12px] border border-dm-line bg-dm-bg-elev p-[18px_22px] text-[13px]">
          <div
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[8px]"
            style={{
              background: 'color-mix(in srgb, var(--color-dm-ok) 12%, transparent)',
              color: 'var(--color-dm-ok)',
            }}
          >
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="flex-1 text-dm-ink-2">
            <strong className="font-semibold text-dm-ink">Verify your download.</strong> All
            artifacts are SHA-256 checksummed and cosign-signed by release key{' '}
            <code className="rounded bg-dm-bg-soft px-[5px] py-[1px] font-[var(--font-dm-mono)] text-[11.5px]">
              0x7F·3C·A2·1E
            </code>
            .
          </div>
          <div className="flex gap-[14px] font-[var(--font-dm-mono)] text-[12px]">
            <IntegrityLink href={`${latest.releaseUrl}#SHA256SUMS`}>SHA256SUMS</IntegrityLink>
            <IntegrityLink href={`${latest.releaseUrl}#SHA256SUMS.sig`}>
              SHA256SUMS.sig
            </IntegrityLink>
            <IntegrityLink href={updaterPublicKeyUrl}>SBOM</IntegrityLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function IntegrityLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="rounded-md border border-dm-line bg-dm-bg px-[10px] py-[6px] text-dm-ink-3 no-underline transition-colors hover:border-dm-line-strong hover:text-dm-ink"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}
