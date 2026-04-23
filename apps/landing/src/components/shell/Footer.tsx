import Link from 'next/link'

export function Footer({ locale }: { locale: string }) {
  const prefix = (href: string) => `/${locale}${href === '/' ? '' : href}`

  return (
    <footer className="border-dm-line border-t py-12 text-[13px] text-dm-ink-3">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-bold text-[15px] text-dm-ink">Dockerman</div>
          <p className="mt-3 max-w-sm text-dm-ink-3">
            Local-first Docker, Podman and Kubernetes. Fast, quiet, and out of
            your way.
          </p>
        </div>
        <div>
          <div className="mb-3 font-medium text-dm-ink">Product</div>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/')}>
                Features
              </Link>
            </li>
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/pricing')}>
                Pricing
              </Link>
            </li>
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/download')}>
                Download
              </Link>
            </li>
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/changelog')}>
                Changelog
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-medium text-dm-ink">Company</div>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/about')}>
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/privacy')}>
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/terms')}>
                Terms
              </Link>
            </li>
            <li>
              <Link className="hover:text-dm-ink" href={prefix('/dpa')}>
                DPA
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] px-8 text-dm-ink-4">
        © {new Date().getFullYear()} Dockerman. All rights reserved.
      </div>
    </footer>
  )
}
