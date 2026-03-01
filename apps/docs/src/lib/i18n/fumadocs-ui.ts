import { defineI18nUI } from 'fumadocs-ui/i18n'
import { i18n } from '@/lib/i18n/fumadocs'

export const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English'
    },
    zh: {
      displayName: '中文',
      search: '搜索文档',
      searchNoResult: '未找到结果',
      toc: '页面内容',
      tocNoHeadings: '暂无标题',
      lastUpdate: '最后更新于',
      chooseLanguage: '选择语言',
      nextPage: '下一页',
      previousPage: '上一页',
      chooseTheme: '主题',
      editOnGithub: '在 GitHub 上编辑'
    }
  }
})
