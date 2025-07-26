// 'use client';
// import { useState } from 'react';
// import styles from '@/styles/components/SmartCropPlannerForm.module.css';
// import SharedVoiceInput from './SharedVoiceInput';

// export default function SmartCropPlannerForm({ t }) {
//   const [region, setRegion] = useState('');
//   const [month, setMonth] = useState('');
//   const [acres, setAcres] = useState('');
//   const [water, setWater] = useState('');
//   const [context, setContext] = useState('');
//   const [lang, setLang] = useState('en');
//   const [latLon, setLatLon] = useState({ lat: null, lon: null });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const fetchLocation = () => {
//     if (!navigator.geolocation) return alert('Geolocation not supported');
//     navigator.geolocation.getCurrentPosition((pos) => {
//       setLatLon({ lat: pos.coords.latitude, lon: pos.coords.longitude });
//     });
//   };

//   const handleSubmit = async () => {
//     if (!region || !month || !acres || !water || !latLon.lat || !latLon.lon) {
//       alert('Please fill all required fields and share location.');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('region', region);
//     formData.append('month', month);
//     formData.append('acres', acres);
//     formData.append('water', water);
//     formData.append('lang', lang);
//     formData.append('lat', latLon.lat);
//     formData.append('lon', latLon.lon);
//     if (context) formData.append('context', context);

//     const res = await fetch('http://localhost:8000/seasonal-plan/', {
//       method: 'POST',
//       body: formData
//     });

//     const data = await res.json();
//     setResult(data);
//     setLoading(false);
//   };

//   return (
//     <div className={styles.formCard}>
//       <h2>{t('Plan for this or future season')}</h2>

//       <input
//         type="text"
//         placeholder="Region"
//         value={region}
//         onChange={(e) => setRegion(e.target.value)}
//       />
//       <SharedVoiceInput onResult={setRegion} lang={lang} label={t('🎤 Speak Region')} />

//       <input
//         type="text"
//         placeholder="Month (e.g. July or October)"
//         value={month}
//         onChange={(e) => setMonth(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Acres of Land"
//         value={acres}
//         onChange={(e) => setAcres(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Water Availability (e.g. low, medium, high)"
//         value={water}
//         onChange={(e) => setWater(e.target.value)}
//       />
//       <textarea
//         placeholder="Optional: Extra context like past crop, soil type, etc."
//         value={context}
//         onChange={(e) => setContext(e.target.value)}
//       />

//       <select value={lang} onChange={(e) => setLang(e.target.value)}>
//         <option value="en">English</option>
//         <option value="kn">ಕನ್ನಡ</option>
//       </select>

//       {!latLon.lat && (
//         <button onClick={fetchLocation}>📍 {t('Share Location')}</button>
//       )}

//       <button onClick={handleSubmit} disabled={loading}>
//         {loading ? t('Planning...') : t('Get Seasonal Plan')}
//       </button>

//       {result && (
//         <div className={styles.resultBox}>
//           <h3>🌾 {t('Crop Plan')}</h3>
//           {/* <p>{result.plan}</p> */}
//         <div dangerouslySetInnerHTML={{ __html: result.plan.replace(/\\n/g, '<br/>') }} />

//           <h4>❤️ {t('Motivation')}</h4>
//           <p>{result.motivation}</p>

//           <button onClick={() => window.location.href = '/market-trends'}>
//             📊 {t('Check Market Trends')}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import styles from '@/styles/components/SmartCropPlannerForm.module.css';
import SharedVoiceInput from './SharedVoiceInput';

export default function SmartCropPlannerForm({ t }) {
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState('');
  const [acres, setAcres] = useState('');
  const [water, setWater] = useState('');
  const [context, setContext] = useState('');
  const [lang, setLang] = useState('en');
  const [latLon, setLatLon] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatLon({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  };

  const formatOutputHTML = (text) => {
    if (!text) return '';
    let formatted = text
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/^- (.*)/gm, '<li>• $1</li>')
      .replace(/([🌾🌱🛠️📌☁️🐛❤️🧠]+)/g, '<strong>$1</strong>');
    return `<p>${formatted}</p>`;
  };

  const handleSubmit = async () => {
    if (!region || !month || !acres || !water || !latLon.lat || !latLon.lon) {
      alert('Please fill all required fields and share location.');
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
    if (context) formData.append('context', context);

    try {
      const res = await fetch('http://localhost:8000/seasonal-plan/', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching plan:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2>{t('Plan for this or future season')}</h2>

      <input
        type="text"
        placeholder={t("Region")}
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <SharedVoiceInput onResult={setRegion} lang={lang} label={t('🎤 Speak Region')} />

      <input
        type="text"
        placeholder={t("Month (e.g. July or October)")}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <input
        type="text"
        placeholder={t("Acres of Land")}
        value={acres}
        onChange={(e) => setAcres(e.target.value)}
      />
      <input
        type="text"
        placeholder={t("Water Availability (e.g. low, medium, high)")}
        value={water}
        onChange={(e) => setWater(e.target.value)}
      />
      <textarea
        placeholder={t("Optional: Extra context like past crop, soil type, etc.")}
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>

      {!latLon.lat && (
        <button onClick={fetchLocation}>📍 {t('Share Location')}</button>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? t('Planning...') : t('Get Seasonal Plan')}
      </button>

      {result && (
        <div className={styles.resultBox}>
          <h3>🌾 {t('Crop Plan')}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: formatOutputHTML(result.plan),
            }}
          />

          <h4>❤️ {t('Motivation')}</h4>
          <p>{result.motivation}</p>

          <button onClick={() => window.location.href = '/dashboard#market-trends'}>
            📊 {t('Check Market Trends')}
          </button>
        </div>
      )}
    </div>
  );
}
