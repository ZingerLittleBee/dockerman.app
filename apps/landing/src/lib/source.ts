import { loader } from 'fumadocs-core/source'
import { i18n } from '@/lib/i18n/fumadocs'
import { docs } from '../../.source/server'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n
})
