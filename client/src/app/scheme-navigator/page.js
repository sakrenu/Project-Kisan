'use client';
import SchemeNavigator from '@/components/SchemeNavigator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
export default function SchemeNavigatorPage() {
   const { t } = useTranslation();
  return (
    <div>
        <Navbar />
        <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          <SchemeNavigator t={t} />
        </main>
        <Footer t={t} />
      </div>
  );
}
