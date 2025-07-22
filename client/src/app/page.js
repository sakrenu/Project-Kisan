'use client';

import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">{t('welcome')}</h1>
        <p className="text-lg text-gray-600 mb-6">{t('select_language')}</p>
        <LanguageSelector />
      </div>
    </div>
  );
}