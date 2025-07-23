import { FaMicrophone } from 'react-icons/fa';
import styles from '@/styles/components/VoiceFirstBanner.module.css';

export default function VoiceFirstBanner({ t }) {
  return (
    <div className={styles.voiceBanner}>
      <div>
        <h3 className={styles.bannerTitle}>{t('dashboard.voice_banner.title')}</h3>
        <p className={styles.bannerText}>{t('dashboard.voice_banner.subtitle')}</p>
      </div>
      <button className={styles.micButton}>
        <FaMicrophone size={24} />
      </button>
    </div>
  );
}