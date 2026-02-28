import { defineI18nUI } from 'fumadocs-ui/i18n'
import { i18n } from '@/lib/i18n/fumadocs'

export const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English'
    },
    zh: {
      displayName: '中文',
      search: '搜索文档'
    }
  }
})
