import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'हिंदी' },
];

export default function LanguageSelector() {
  const { setLanguage } = useContext(LanguageContext);

  return (
    <div className="space-y-3">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className="language-btn"
        >
          <i className="fas fa-language mr-2 text-green-600"></i> {lang.name}
        </button>
      ))}
    </div>
  );
}