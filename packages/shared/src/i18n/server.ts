import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import en from '../locales/en.json'
import es from '../locales/es.json'
import ja from '../locales/ja.json'
import zh from '../locales/zh.json'
import { getOptions, type Locale } from './settings'

const resources = {
  en: { translation: en },
  es: { translation: es },
  ja: { translation: ja },
  zh: { translation: zh }
}

const initI18next = async (lng: Locale) => {
  const i18nInstance = createInstance()
  await i18nInstance.use(initReactI18next).init({
    ...getOptions(lng),
    resources
  })
  return i18nInstance
}

export async function getTranslation(lng: Locale) {
  const i18nextInstance = await initI18next(lng)
  return {
    t: i18nextInstance.getFixedT(lng),
    i18n: i18nextInstance
  }
}
