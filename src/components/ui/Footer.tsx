'use client'

import { useLocale, useTranslation } from '@/lib/i18n/client'
import { Logo } from '../../../public/logo'
import ThemeSwitch from '../ThemeSwitch'
import { TrackedFooterLink } from './TrackedFooterLinks'

export default function Footer() {
  const locale = useLocale()
  const { t } = useTranslation()

  const navigation = {
    product: [
      { name: t('footer.links.download'), href: `/${locale}/download`, external: false },
      { name: t('footer.links.changelog'), href: `/${locale}/changelog`, external: false }
    ],
    resources: [
      {
        name: t('footer.links.github'),
        href: 'https://github.com/ZingerLittleBee/dockerman.app',
        external: true
      }
    ],
    company: [{ name: t('footer.links.about'), href: `/${locale}/about`, external: false }],
    legal: [
      { name: t('footer.links.privacy'), href: `/${locale}/privacy`, external: false },
      { name: t('footer.links.terms'), href: `/${locale}/terms`, external: false },
      { name: t('footer.links.dpa'), href: `/${locale}/dpa`, external: false }
    ]
  }

  return (
    <footer id="footer">
      <div className="mx-auto max-w-6xl px-3 pt-16 pb-8 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-20">
          <div className="space-y-8">
            <Logo className="w-32 sm:w-40" />
            <p className="text-gray-600 text-sm leading-6 dark:text-gray-400">
              {t('footer.description')}
            </p>
            <div className="flex space-x-6">
              <ThemeSwitch />
            </div>
            <div />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.product')}
                </h3>
                <ul aria-label="Quick links Product" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <TrackedFooterLink
                        external={item.external}
                        href={item.href}
                        name={item.name}
                        section="product"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.resources')}
                </h3>
                <ul aria-label="Quick links Resources" className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <TrackedFooterLink
                        external={item.external}
                        href={item.href}
                        name={item.name}
                        section="resources"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.company')}
                </h3>
                <ul aria-label="Quick links Company" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <TrackedFooterLink
                        external={item.external}
                        href={item.href}
                        name={item.name}
                        section="company"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">
                  {t('footer.legal')}
                </h3>
                <ul aria-label="Quick links Legal" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li className="w-fit" key={item.name}>
                      <TrackedFooterLink
                        external={item.external}
                        href={item.href}
                        name={item.name}
                        section="legal"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-gray-200 border-t pt-8 sm:mt-20 sm:flex-row lg:mt-24 dark:border-gray-800">
          <p className="text-gray-500 text-sm leading-5 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="rounded-full border border-gray-200 py-1 pr-2 pl-1 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <div className="relative size-4 shrink-0">
                <div className="absolute inset-[1px] rounded-full bg-emerald-500/20 dark:bg-emerald-600/20" />
                <div className="absolute inset-1 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              </div>
              <span className="text-gray-700 text-xs dark:text-gray-50">{t('footer.status')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
