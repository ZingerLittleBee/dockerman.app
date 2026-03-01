import Link from 'next/link'
import { Button } from '@/components/Button'
import { ArrowAnimated } from '@/components/ui/ArrowAnimated'
import { Logo } from '../../public/logo'
import { siteConfig } from './siteConfig'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link href={siteConfig.baseLinks.home}>
        <Logo className="mt-6 h-10" />
      </Link>
      <p className="mt-6 font-semibold text-4xl text-indigo-600 sm:text-5xl dark:text-indigo-500">
        404
      </p>
      <h1 className="mt-4 font-semibold text-2xl text-gray-900 dark:text-gray-50">
        Page not found
      </h1>
      <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Button asChild className="group mt-8" variant="light">
        <Link href={siteConfig.baseLinks.home}>
          Go to the home page
          <ArrowAnimated aria-hidden="true" className="stroke-gray-900 dark:stroke-gray-50" />
        </Link>
      </Button>
    </div>
  )
}
