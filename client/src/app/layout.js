import '../styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export const metadata = {
  title: 'Project Kisan',
  description: 'Smart Farming for Indian Farmers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </body>
    </html>
  );
}