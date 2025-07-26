// // // // client/src/components/PlantScanCard.jsx

// // // 'use client';
// // // import { useState, useRef } from 'react';
// // // import styles from '@/styles/components/PlantScanCard.module.css';

// // // export default function PlantScanCard({ t }) {
// // //   const [image, setImage] = useState(null);
// // //   const [prompt, setPrompt] = useState('');
// // //   const [language, setLanguage] = useState('en');
// // //   const [loading, setLoading] = useState(false);
// // //   const [result, setResult] = useState(null);
// // //   const [stores, setStores] = useState([]);
// // //   const recognitionRef = useRef(null);

// // //   const handleImageUpload = (e) => {
// // //     const file = e.target.files[0];
// // //     if (file) setImage(file);
// // //   };

// // //   const handleVoiceInput = () => {
// // //     if (!('webkitSpeechRecognition' in window)) {
// // //       alert('Your browser does not support Speech Recognition');
// // //       return;
// // //     }
// // //     const recognition = new webkitSpeechRecognition();
// // //     recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
// // //     recognition.onresult = (event) => {
// // //       setPrompt(event.results[0][0].transcript);
// // //     };
// // //     recognition.start();
// // //     recognitionRef.current = recognition;
// // //   };

// // //   const handleSubmit = async () => {
// // //     if (!image) return alert('Please upload a plant image');
// // //     if (!navigator.geolocation) return alert('Geolocation not supported');

// // //     setLoading(true);
// // //     navigator.geolocation.getCurrentPosition(async (position) => {
// // //       const formData = new FormData();
// // //       formData.append('image', image);
// // //       formData.append('prompt', prompt);
// // //       formData.append('lang', language);
// // //       formData.append('lat', position.coords.latitude);
// // //       formData.append('lon', position.coords.longitude);

// // //       const res = await fetch('http://localhost:8000/analyze-plant/', {
// // //         method: 'POST',
// // //         body: formData
// // //       });

// // //       const data = await res.json();
// // //       setResult(data.analysis);
// // //       setStores(data.stores);
// // //       setLoading(false);
// // //     });
// // //   };

// // //   return (
// // //     <div className={styles.card}>
// // //       <h2>{t('dashboard.services.krishi_scan.title') || 'Krishi Scan'}</h2>

// // //       <label>{t('Upload Image')}:</label>
// // //       <input type="file" accept="image/*" onChange={handleImageUpload} />

// // //       <label>{t('Speak or Type Your Concern')}:</label>
// // //       <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
// // //       <button onClick={handleVoiceInput}>🎤 {t('Voice Input')}</button>

// // //       <label>{t('Language')}:</label>
// // //       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
// // //         <option value="en">English</option>
// // //         <option value="kn">ಕನ್ನಡ</option>
// // //       </select>

// // //       <button onClick={handleSubmit} disabled={loading}>
// // //         {loading ? 'Analyzing...' : 'Detect Disease'}
// // //       </button>

// // //       {result && (
// // //         <div className={styles.results}>
// // //           <h3>{t('Analysis')}</h3>
// // //           <p>{result}</p>

// // //           {stores.length > 0 && (
// // //             <>
// // //               <h4>{t('Nearby Agri Stores')}</h4>
// // //               <ul>
// // //                 {stores.map((store, idx) => (
// // //                   <li key={idx}>{store.name} - {store.location}</li>
// // //                 ))}
// // //               </ul>
// // //             </>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // client/src/components/PlantScanCard.jsx

// // 'use client';
// // import { useState, useRef } from 'react';
// // import styles from '@/styles/components/PlantScanCard.module.css';

// // export default function PlantScanCard({ t }) {
// //   const [image, setImage] = useState(null);
// //   const [prompt, setPrompt] = useState('');
// //   const [language, setLanguage] = useState('en');
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [stores, setStores] = useState([]);
// //   const recognitionRef = useRef(null);

// //   const handleImageUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) setImage(file);
// //   };

// //   const handleVoiceInput = () => {
// //     if (!('webkitSpeechRecognition' in window)) {
// //       alert('Your browser does not support Speech Recognition');
// //       return;
// //     }
// //     const recognition = new webkitSpeechRecognition();
// //     recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
// //     recognition.onresult = (event) => {
// //       setPrompt(event.results[0][0].transcript);
// //     };
// //     recognition.start();
// //     recognitionRef.current = recognition;
// //   };

// //   const handleSubmit = async () => {
// //     if (!image) return alert('Please upload a plant image');
// //     if (!navigator.geolocation) return alert('Geolocation not supported');

// //     setLoading(true);
// //     navigator.geolocation.getCurrentPosition(async (position) => {
// //       const formData = new FormData();
// //       formData.append('image', image);
// //       formData.append('prompt', prompt);
// //       formData.append('lang', language);
// //       formData.append('lat', position.coords.latitude);
// //       formData.append('lon', position.coords.longitude);

// //       const res = await fetch('http://localhost:8000/analyze-plant/', {
// //         method: 'POST',
// //         body: formData
// //       });

// //       const data = await res.json();
// //       setResult(data.analysis);
// //       setStores(data.stores);
// //       setLoading(false);
// //     });
// //   };

// //   return (
// //     <div className={styles.card}>
// //       <h2>{t('dashboard.services.krishi_scan.title') || 'Krishi Scan'}</h2>

// //       <label>{t('Upload Image')}:</label>
// //       <input type="file" accept="image/*" onChange={handleImageUpload} />

// //       <label>{t('Speak or Type Your Concern')}:</label>
// //       <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
// //       <button onClick={handleVoiceInput}>🎤 {t('Voice Input')}</button>

// //       <label>{t('Language')}:</label>
// //       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
// //         <option value="en">English</option>
// //         <option value="kn">ಕನ್ನಡ</option>
// //       </select>

// //       <button onClick={handleSubmit} disabled={loading}>
// //         {loading ? 'Analyzing...' : 'Detect Disease'}
// //       </button>

// //       {result && (
// //         <div className={styles.results}>
// //           <h3>{t('Analysis')}</h3>
// //           <p>{result}</p>

// //           {stores.length > 0 && (
// //             <>
// //               <h4>{t('Nearby Agri Stores')}</h4>
// //               <ul>
// //                 {stores.map((store, idx) => (
// //                   <li key={idx}>{store.name} - {store.location}</li>
// //                 ))}
// //               </ul>
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // // above is the one without any previe w------------------
// // client/src/components/PlantScanCard.jsx

// 'use client';
// import { useState, useRef } from 'react';
// import styles from '@/styles/components/PlantScanCard.module.css';

// export default function PlantScanCard({ t }) {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [prompt, setPrompt] = useState('');
//   const [language, setLanguage] = useState('en');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [stores, setStores] = useState([]);
//   const recognitionRef = useRef(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleVoiceInput = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert('Your browser does not support Speech Recognition');
//       return;
//     }
//     const recognition = new webkitSpeechRecognition();
//     recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
//     recognition.onresult = (event) => {
//       setPrompt(event.results[0][0].transcript);
//     };
//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   const speakText = () => {
//     if (!result) return;
//     const utterance = new SpeechSynthesisUtterance(result);
//     utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleSubmit = async () => {
//     if (!image) return alert('Please upload a plant image');
//     if (!navigator.geolocation) return alert('Geolocation not supported');

//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       const formData = new FormData();
//       formData.append('image', image);
//       formData.append('prompt', prompt);
//       formData.append('lang', language);
//       formData.append('lat', position.coords.latitude);
//       formData.append('lon', position.coords.longitude);

//       const res = await fetch('http://localhost:8000/analyze-plant/', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       setResult(data.analysis);
//       setStores(data.stores);
//       setLoading(false);
//     });
//   };

//   return (
//     <div className={styles.card}>
//       <h2>{t('dashboard.services.krishi_scan.title') || 'Krishi Scan'}</h2>

//       <label>{t('Upload Image')}:</label>
//       <input
//         type="file"
//         accept="image/*"
//         capture="environment"
//         onChange={handleImageUpload}
//       />
//       {preview && <img src={preview} alt="preview" className={styles.imagePreview} />}

//       <label>{t('Speak or Type Your Concern')}:</label>
//       <textarea
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//       />
//       <button onClick={handleVoiceInput}>🎤 {t('Voice Input')}</button>

//       <label>{t('Language')}:</label>
//       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//         <option value="en">English</option>
//         <option value="kn">ಕನ್ನಡ</option>
//       </select>

//       <button onClick={handleSubmit} disabled={loading}>
//         {loading ? 'Analyzing...' : 'Detect Disease'}
//       </button>

//       {result && (
//         <div className={styles.results}>
//           <h3>{t('Analysis')}</h3>
//           <p>{result}</p>
//           <button onClick={speakText}>🔊 {t('Speak this')}</button>

//           {stores.length > 0 && (
//             <>
//               <h4>{t('Nearby Agri Stores')}</h4>
//               <ul>
//                 {stores.map((store, idx) => (
//                   <li key={idx}>
//                     {store.name} - {store.location}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
// // -----this one is with tts speech button but no stop 
'use client';
import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/PlantScanCard.module.css';

export default function PlantScanCard({ t }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stores, setStores] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices(); // Initial load
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
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

  const speakText = () => {
    if (!result) return;

    const utterance = new SpeechSynthesisUtterance(result);

    // Try to find Kannada voice
    const matchedVoice = availableVoices.find(
      (v) =>
        (language === 'kn' && v.lang === 'kn-IN') ||
        (language === 'kn' && v.name.toLowerCase().includes('kannada')) ||
        (language === 'en' && v.lang === 'en-US')
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const pauseOrResume = () => {
    if (!isSpeaking) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
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
        body: formData,
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
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
      />
      {preview && <img src={preview} alt="preview" className={styles.imagePreview} />}

      <label>{t('Speak or Type Your Concern')}:</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={speakText}>🔊 {t('Speak this')}</button>
            {isSpeaking && (
              <button onClick={pauseOrResume}>
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
          </div>

          {stores.length > 0 && (
            <>
              <h4>{t('Nearby Agri Stores')}</h4>
              <ul>
                {stores.map((store, idx) => (
                  <li key={idx}>
                    {store.name} - {store.location}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
