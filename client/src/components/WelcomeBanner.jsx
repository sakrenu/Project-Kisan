import styles from '@/styles/components/WelcomeBanner.module.css';

export default function WelcomeBanner({ t }) {
  return (
    <div className={styles.welcomeBanner}>
      <h1 className={styles.title}>{t('dashboard.welcome')}</h1>
      <p className={styles.subtitle}>{t('dashboard.daily_tip')}</p>
    </div>
  );
}