'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
];

export default function LanguageSelector() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    router.push('/login');
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-green-50 hover:text-green-600 transition"
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}