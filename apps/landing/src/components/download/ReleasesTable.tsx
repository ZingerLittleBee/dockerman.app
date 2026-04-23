import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'
import { downloadsConfig } from '@/config/downloads'

const NOTES: Record<string, string> = {
  'release-v5-1-0':
    'Podman support, Cloudflared tunnels, image-upgrade detection, container backup/restore',
  'release-v5-0-4': 'Critical fix for WSL2 socket forwarding; improved disk usage breakdown',
  'release-v5-0-0': 'Full Kubernetes management, Helm support, port-forwarding with local DNS',
  'release-v4-8-0': 'Trivy security scanning, image push with credential auto-match',
  'release-v4-6-2': 'Tray improvements, locale fixes',
  'release-v4-5-0': 'Container file browser, in-place editing with syntax highlighting',
  'release-v4-2-0': 'Command palette (⌘;), system tray with live CPU/mem, event notifications',
  'release-v4-0-0': 'Compose project grouping, docker-run command parser, redesigned stats page',
}

export function ReleasesTable({ locale }: { locale: Locale }) {
  return (
    <section className="px-8 pt-20 pb-10">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-8 max-w-[680px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent-2)' }}
          >
            <span className="text-dm-ink-4">// </span>history
          </div>
          <h2 className="mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
            Previous{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              releases.
            </em>
          </h2>
          <p className="m-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">
            Pin to an older tag if you need it. Every release is kept online indefinitely.
          </p>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev">
          {downloadsConfig.history.map((h, i) => (
            <div
              className="grid items-center gap-4 border-dm-line border-b px-[22px] py-[14px] last:border-b-0 hover:bg-dm-bg-soft"
              key={h.version}
              style={{ gridTemplateColumns: '120px 1fr 180px 80px' }}
            >
              <div className="font-[var(--font-dm-mono)] font-semibold text-[13px] tracking-[-0.01em]">
                v{h.version}
                {i === 0 ? (
                  <span
                    className="ml-2 rounded px-[6px] py-[2px] font-bold text-[9.5px] tracking-[0.04em]"
                    style={{
                      background:
                        'color-mix(in srgb, var(--color-dm-accent-2) 14%, transparent)',
                      color: 'var(--color-dm-accent-2)',
                    }}
                  >
                    LATEST
                  </span>
                ) : null}
              </div>
              <div className="hidden truncate text-[13px] text-dm-ink-2 md:block">
                {NOTES[h.summarySlug] ?? 'Release notes'}
              </div>
              <div className="font-[var(--font-dm-mono)] text-[12px] text-dm-ink-4">{h.date}</div>
              <Link
                className="text-right font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3 no-underline hover:text-[var(--color-dm-accent-2)]"
                href={`/${locale}/changelog#${h.summarySlug}`}
              >
                notes →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
