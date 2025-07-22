// import '../styles/globals.css';
import '../styles/main.css'; // Add this import
import ClientWrapper from '../components/ClientWrapper';

export const metadata = {
  title: 'Project Kisan',
  description: 'Smart Farming for Indian Farmers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#006400" />
      </head>
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}