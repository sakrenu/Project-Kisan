'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import WelcomeBanner from '@/components/WelcomeBanner';
import AIAssistantCard from '@/components/AIAssistantCard';
import QuickActions from '@/components/QuickActions';
import VoiceFirstBanner from '@/components/VoiceFirstBanner';
import ServiceGrid from '@/components/ServiceGrid';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
//   const { t } = useLanguage();
const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <WelcomeBanner t={t} />
        <AIAssistantCard t={t} />
        <QuickActions t={t} />
        <VoiceFirstBanner t={t} />
        <ServiceGrid t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}