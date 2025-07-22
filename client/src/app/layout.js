import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'

export const metadata = {
  title: 'Project Kisan',
  description: 'Smart Farming App for Indian Farmers',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}