// client/src/components/PlantScanCard.jsx

'use client';
import { useState, useRef } from 'react';
import styles from '@/styles/components/PlantScanCard.module.css';

export default function PlantScanCard({ t }) {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stores, setStores] = useState([]);
  const recognitionRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition');
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    recognition.onresult = (event) => {
      setPrompt(event.results[0][0].transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSubmit = async () => {
    if (!image) return alert('Please upload a plant image');
    if (!navigator.geolocation) return alert('Geolocation not supported');

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt);
      formData.append('lang', language);
      formData.append('lat', position.coords.latitude);
      formData.append('lon', position.coords.longitude);

      const res = await fetch('http://localhost:8000/analyze-plant/', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setResult(data.analysis);
      setStores(data.stores);
      setLoading(false);
    });
  };

  return (
    <div className={styles.card}>
      <h2>{t('dashboard.services.krishi_scan.title') || 'Krishi Scan'}</h2>

      <label>{t('Upload Image')}:</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <label>{t('Speak or Type Your Concern')}:</label>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleVoiceInput}>🎤 {t('Voice Input')}</button>

      <label>{t('Language')}:</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Detect Disease'}
      </button>

      {result && (
        <div className={styles.results}>
          <h3>{t('Analysis')}</h3>
          <p>{result}</p>

          {stores.length > 0 && (
            <>
              <h4>{t('Nearby Agri Stores')}</h4>
              <ul>
                {stores.map((store, idx) => (
                  <li key={idx}>{store.name} - {store.location}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
