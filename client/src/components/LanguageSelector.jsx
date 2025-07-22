'use client';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
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
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className="language-button"
        >
          <span className="language-code">
            {lang.code.toUpperCase()}
          </span>
          {lang.name}
        </button>
      ))}
    </div>
  );
}