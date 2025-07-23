import styles from '@/styles/components/Footer.module.css';

export default function Footer({ t }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <h2 className={styles.footerLogo}>
            <span>{t('app.name_part1')}</span>
            <span className={styles.logoHighlight}>{t('app.name_part2')}</span>
          </h2>
          <p className={styles.footerTagline}>{t('footer.tagline')}</p>
        </div>
        <div className={styles.socialIcons}>
          <span className={styles.socialIcon}>f</span>
          <span className={styles.socialIcon}>t</span>
          <span className={styles.socialIcon}>w</span>
          <span className={styles.socialIcon}>y</span>
        </div>
      </div>
    </footer>
  );
}