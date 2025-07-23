import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaCloudSun } from 'react-icons/fa';
import styles from '@/styles/components/QuickActions.module.css';

export default function QuickActions({ t }) {
  const actions = [
    { icon: <FaSearch size={20} />, key: "market" },
    { icon: <FaCalendarAlt size={20} />, key: "calendar" },
    { icon: <FaMapMarkerAlt size={20} />, key: "stores" },
    { icon: <FaCloudSun size={20} />, key: "weather" }
  ];

  return (
    <div className={styles.quickActions}>
      {actions.map((action, index) => (
        <button key={index} className={styles.actionButton}>
          <div className={styles.actionIcon}>{action.icon}</div>
          <span className={styles.actionLabel}>{t(`dashboard.quick_actions.${action.key}`)}</span>
        </button>
      ))}
    </div>
  );
}