import Image from 'next/image';
import { FaBell, FaUser } from 'react-icons/fa';
import styles from '@/styles/components/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image 
            src="/logo.svg" 
            alt="KrishiDost Logo" 
            width={40} 
            height={40} 
          />
          <h1 className={styles.appName}>
            <span className={styles.appNamePart1}>Krishi</span>
            <span className={styles.appNamePart2}>Dost</span>
          </h1>
        </div>
        
        <div className={styles.menu}>
          <a href="#" className={styles.menuItem}>Dashboard</a>
          <a href="#" className={styles.menuItem}>Services</a>
          <a href="#" className={styles.menuItem}>Schemes</a>
          <a href="#" className={styles.menuItem}>Market</a>
        </div>
        
        <div className={styles.userActions}>
          <button className={styles.iconButton}>
            <FaBell size={20} />
          </button>
          <button className={styles.iconButton}>
            <FaUser size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}