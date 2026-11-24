import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import Link from 'next/link'
import { BrandMark } from '@/components/shell/BrandMark'

export async function Footer({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const prefix = (href: string) => `/${locale}${href === '/' ? '' : href}`
  const copyrightYear = new Date().getFullYear()

  return (
    <footer className="border-dm-line border-t py-10 text-[13px] text-dm-ink-3 sm:py-12">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          {/* Brand column */}
          <div className="flex max-w-[300px] flex-col gap-[10px]">
            <Link
              className="dm-focus-ring flex items-center self-start rounded-md text-[15px] text-dm-ink"
              href={prefix('/')}
            >
              <BrandMark />
            </Link>
            <p className="m-0 text-dm-ink-3">{t('footer.tagline')}</p>
          </div>

          {/* Product */}
          <FooterCol heading={t('footer.columns.product')}>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/download')}
            >
              {t('footer.links.download')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/#features')}
            >
              {t('footer.links.features')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/changelog')}
            >
              {t('footer.links.changelog')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/pricing')}
            >
              {t('footer.links.pricing')}
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/vs-docker-desktop')}>
              {t('footer.links.compare')}
            </Link>
          </FooterCol>

          {/* Docs */}
          <FooterCol heading={t('footer.columns.docs')}>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/docs/getting-started')}
            >
              {t('footer.links.gettingStarted')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/docs/kubernetes/overview')}
            >
              {t('footer.links.kubernetes')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/docs/homelab')}
            >
              {t('footer.links.homelab')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/docs/reference/troubleshooting')}
            >
              {t('footer.links.troubleshooting')}
            </Link>
          </FooterCol>

          {/* Community */}
          <FooterCol heading={t('footer.columns.community')}>
            <a
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href="https://github.com/ZingerLittleBee/dockerman.app"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('footer.links.github')}
            </a>
            <a
              className="dm-focus-ring rounded-sm font-[var(--font-dm-mono)] text-[12.5px] fine-hover:hover:text-dm-ink"
              href="mailto:support@dockerman.app"
            >
              support@dockerman.app
            </a>
          </FooterCol>

          {/* Legal */}
          <FooterCol heading={t('footer.columns.legal')}>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/privacy')}
            >
              {t('footer.links.privacy')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/terms')}
            >
              {t('footer.links.terms')}
            </Link>
            <Link
              className="dm-focus-ring rounded-sm fine-hover:hover:text-dm-ink"
              href={prefix('/dpa')}
            >
              {t('footer.links.dpa')}
            </Link>
          </FooterCol>
        </div>

        {/* Foot note: copyright + tagline */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-dm-line border-t pt-5 font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
          <span>© {copyrightYear} Dockerman</span>
          <span>{t('footer.note')}</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <span className="mb-1 font-semibold text-[12px] text-dm-ink">{heading}</span>
      {children}
    </div>
  )
}
