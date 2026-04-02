import { defineI18n } from 'fumadocs-core/i18n'

export const i18n = defineI18n({
  languages: ['en', 'zh', 'ja', 'es'],
  defaultLanguage: 'en',
  parser: 'dir',
  hideLocale: 'never'
})
