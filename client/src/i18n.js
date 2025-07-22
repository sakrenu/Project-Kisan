import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;