import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'

export function CtaFinal({ locale }: { locale: Locale }) {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto max-w-[1240px] rounded-[20px] border border-dm-line bg-dm-bg-elev px-10 py-16 text-center">
        <h2 className="font-bold text-[40px] text-dm-ink leading-[1.05] tracking-[-0.03em]">
          Ready to tame{' '}
          <span
            className="italic"
            style={{ fontFamily: 'var(--font-dm-display)', color: 'var(--color-dm-accent)' }}
          >
            your containers?
          </span>
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            className="rounded-lg border border-dm-ink bg-dm-ink px-5 py-[10px] font-medium text-[14px] text-dm-bg"
            href={`/${locale}/download`}
          >
            Download
          </Link>
          <Link
            className="rounded-lg border border-dm-line-strong bg-transparent px-5 py-[10px] font-medium text-[14px] text-dm-ink"
            href={`/${locale}/docs/getting-started`}
          >
            Docs
          </Link>
          <a
            className="rounded-lg border border-dm-line-strong bg-transparent px-5 py-[10px] font-medium text-[14px] text-dm-ink"
            href="https://github.com/ZingerLittleBee/dockerman.app"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
