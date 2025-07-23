import styles from '@/styles/components/ServiceGrid.module.css';

export default function ServiceGrid({ t }) {
  const services = [
    { key: "market_analysis", icon: "📈" },
    { key: "scheme_navigator", icon: "📋" },
    { key: "store_finder", icon: "🏪" },
    { key: "krishi_guide", icon: "🌱" },
    { key: "krishi_scan", icon: "🔍" },
    { key: "smart_alerts", icon: "🔔" },
    { key: "local_dialects", icon: "🗣️" },
    { key: "weather_smart", icon: "⛅" }
  ];

  return (
    <div className={styles.serviceGrid}>
      <h2 className={styles.sectionTitle}>{t('dashboard.services.title')}</h2>
      <div className={styles.gridContainer}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.serviceIcon}>{service.icon}</div>
            <h3 className={styles.serviceTitle}>{t(`dashboard.services.${service.key}.title`)}</h3>
            <p className={styles.serviceDescription}>
              {t(`dashboard.services.${service.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}