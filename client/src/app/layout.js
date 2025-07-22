import '../styles/globals.css';
import ClientWrapper from '../components/ClientWrapper';

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
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}