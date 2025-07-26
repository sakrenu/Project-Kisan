// client/src/app/seasonal-planner/page.js

'use client';
import CropPlannerCard from '@/components/CropPlannerCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';

export default function SeasonalPlannerPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <CropPlannerCard t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
