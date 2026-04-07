import { defaultLocale } from '@repo/shared/i18n'
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
