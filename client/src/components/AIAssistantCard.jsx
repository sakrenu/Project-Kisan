import { FaPhone, FaMicrophone } from 'react-icons/fa';
import styles from '@/styles/components/AIAssistantCard.module.css';

export default function AIAssistantCard() {
  const exampleQueries = [
    "What's the tomato price today?",
    "How to treat yellow leaves?",
    "Subsidy for tractor?"
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Krishi AI Assistant</h2>
      <p className={styles.cardDescription}>
        Get instant answers in your local language via call or chat
      </p>
      
      <div className={styles.queryContainer}>
        {exampleQueries.map((query, index) => (
          <button 
            key={index}
            className={styles.queryPill}
          >
            {query}
            <FaMicrophone className={styles.micIcon} size={12} />
          </button>
        ))}
      </div>
      
      <div className={styles.actionContainer}>
        <button className={styles.callButton}>
          <FaPhone />
          <span>Call Now</span>
        </button>
        
        <button className={styles.chatButton}>
          Chat Instead →
        </button>
      </div>
    </div>
  );
}