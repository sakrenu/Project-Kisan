'use client';
import { useState } from 'react';
import styles from '@/styles/components/PlantScanCard.module.css'; // reusing styles
import { useRouter } from 'next/navigation';

export default function CropPlannerCard({ t }) {
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState('');
  const [acres, setAcres] = useState('');
  const [water, setWater] = useState('');
  const [lang, setLang] = useState('en');
  const [latLon, setLatLon] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const router = useRouter();

  const fetchLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatLon({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  };

  const handleSubmit = async () => {
    if (!region || !month || !acres || !water || !latLon.lat || !latLon.lon) {
      alert('Please fill all fields and share location.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('region', region);
    formData.append('month', month);
    formData.append('acres', acres);
    formData.append('water', water);
    formData.append('lang', lang);
    formData.append('lat', latLon.lat);
    formData.append('lon', latLon.lon);

    const res = await fetch('http://localhost:8000/seasonal-plan/', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <h2>{t('Seasonal Planning') || 'Seasonal Planning'}</h2>

      <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
      <input type="text" placeholder="Current Month" value={month} onChange={(e) => setMonth(e.target.value)} />
      <input type="text" placeholder="Acres of Land" value={acres} onChange={(e) => setAcres(e.target.value)} />
      <input type="text" placeholder="Water Availability" value={water} onChange={(e) => setWater(e.target.value)} />

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>

      {!latLon.lat && (
        <button onClick={fetchLocation}>📍 Share Location</button>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Planning...' : 'Get Crop Suggestion'}
      </button>

      {response && (
        <div className={styles.results}>
          <h3>🌱 Crop Suggestions & Advice</h3>
          <p>{response.plan}</p>

          <h4>❤️ Motivation</h4>
          <p>{response.motivation}</p>

          <button onClick={() => router.push('/market-trends')}>
            📊 Check Market Trends
          </button>
        </div>
      )}
    </div>
  );
}
