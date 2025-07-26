'use client';
import MarketTrends from '@/components/MarketTrends';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
export default function MarketTrendsPage() {
   const { t } = useTranslation();
  return (
    <div>
        <Navbar />
        <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          <MarketTrends t={t} />
        </main>
        <Footer t={t} />
      </div>
  );
   
}
