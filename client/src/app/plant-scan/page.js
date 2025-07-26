// client/src/app/plant-scan/page.js

'use client';
import PlantScanCard from '@/components/PlantScanCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';

export default function PlantScanPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <PlantScanCard t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
