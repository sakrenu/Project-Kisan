import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../public/locales/en/common.json';
import knTranslation from '../public/locales/kn/common.json';

const resources = {
  en: { common: enTranslation },
  kn: { common: knTranslation },
  hi: { common: {} },
  mr: { common: {} },
  ta: { common: {} },
  te: { common: {} },
  pa: { common: {} },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;