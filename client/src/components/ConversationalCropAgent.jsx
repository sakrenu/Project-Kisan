// // 'use client';
// // import { useState } from 'react';
// // // import styles from '@/styles/components/PlantScanCard.module.css';
// // import styles from '@/styles/components/ConversationalCropAgent.module.css';


// // export default function ConversationalCropAgent({ t }) {
// //   const [messages, setMessages] = useState([
// //     {
// //       sender: 'agent',
// //       text: t('Namaskara! What would you like help with today? You can ask in English or Kannada.')
// //     }
// //   ]);
// //   const [step, setStep] = useState(0);
// //   const [input, setInput] = useState('');
// //   const [formData, setFormData] = useState({
// //     user_goal: '',
// //     region: '',
// //     lat: null,
// //     lon: null,
// //     month: '',
// //     acres: '',
// //     water: '',
// //     lang: 'en'
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [suggestion, setSuggestion] = useState(null);

// //   const handleInputSubmit = async () => {
// //     if (!input.trim()) return;
// //     const newMessages = [...messages, { sender: 'farmer', text: input }];

// //     switch (step) {
// //       case 0:
// //         newMessages.push({ sender: 'agent', text: t('Great! Can you tell me your region or click below to share location?') });
// //         setFormData({ ...formData, user_goal: input });
// //         break;
// //       case 1:
// //         newMessages.push({ sender: 'agent', text: t('How many acres and what is the water availability?') });
// //         setFormData({ ...formData, region: input });
// //         break;
// //       case 2:
// //         const [acres, water] = input.split(',');
// //         newMessages.push({ sender: 'agent', text: t('Let me prepare a seasonal plan for you...') });
// //         setFormData({ ...formData, acres: acres?.trim(), water: water?.trim() });
// //         setLoading(true);

// //         const payload = new FormData();
// //         Object.entries({ ...formData, acres: acres?.trim(), water: water?.trim() }).forEach(([k, v]) =>
// //           payload.append(k, v)
// //         );

// //         const res = await fetch('http://localhost:8000/seasonal-plan/', {
// //           method: 'POST',
// //           body: payload
// //         });
// //         const data = await res.json();
// //         setSuggestion(data);
// //         setLoading(false);
// //         break;
// //       default:
// //         newMessages.push({
// //           sender: 'agent',
// //           text: t('This is beyond seasonal planning. You can try our Krishi Scan or Market Trends sections!')
// //         });
// //         break;
// //     }

// //     setMessages(newMessages);
// //     setInput('');
// //     setStep(step + 1);
// //   };

// //   const handleShareLocation = () => {
// //     if (!navigator.geolocation) return alert('Geolocation not supported');
// //     navigator.geolocation.getCurrentPosition((pos) => {
// //       setFormData({ ...formData, lat: pos.coords.latitude, lon: pos.coords.longitude });
// //       setMessages([
// //         ...messages,
// //         {
// //           sender: 'agent',
// //           text: t('Location received ✅. Now tell me how many acres and what is the water condition (e.g. 2 acres, low water)?')
// //         }
// //       ]);
// //       setStep(2);
// //     });
// //   };

// //   return (
// //     <div className={styles.card}>
// //       <div>
// //         {messages.map((msg, idx) => (
// //           <p
// //             key={idx}
// //             style={{
// //               backgroundColor: msg.sender === 'agent' ? '#f0f8ff' : '#e6ffe6',
// //               padding: '0.5rem',
// //               borderRadius: '0.5rem',
// //               marginBottom: '0.5rem',
// //               textAlign: msg.sender === 'agent' ? 'left' : 'right'
// //             }}
// //           >
// //             {msg.text}
// //           </p>
// //         ))}
// //       </div>

// //       {!suggestion && (
// //         <>
// //           <input
// //             type="text"
// //             value={input}
// //             placeholder={t('Type your response...')}
// //             onChange={(e) => setInput(e.target.value)}
// //           />
// //           <button onClick={handleInputSubmit}>{t('Send')}</button>
// //           {step === 1 && <button onClick={handleShareLocation}>📍 {t('Share Location')}</button>}
// //         </>
// //       )}

// //       {loading && <p>🧠 {t('Planning your seasonal strategy...')}</p>}

// //       {suggestion && (
// //         <div className={styles.results}>
// //           <h3>🌾 {t('Your Seasonal Crop Plan')}</h3>
// //           <p>{suggestion.plan}</p>
// //           <h4>❤️ {t('Motivation')}</h4>
// //           <p>{suggestion.motivation}</p>
// //           <button onClick={() => window.location.href = '/market-trends'}>
// //             📊 {t('Check Market Trends')}
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// client/src/components/ConversationalCropAgent.jsx

'use client';
import { useState } from 'react';
import styles from '@/styles/components/ConversationalCropAgent.module.css';
import SharedVoiceInput from './SharedVoiceInput';

export default function ConversationalCropAgent({ t }) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: t('Namaskara! What would you like help with today? You can reply in English or Kannada.')
    }
  ]);

  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('en');
  const [formData, setFormData] = useState({
    user_goal: '',
    region: '',
    lat: null,
    lon: null,
    acres: '',
    water: '',
    month: '',
    context: ''
  });

  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleSubmit = async () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    payload.append('lang', lang);

    const res = await fetch('http://localhost:8000/seasonal-plan/', {
      method: 'POST',
      body: payload
    });

    const data = await res.json();
    setSuggestion(data);
    setLoading(false);
  };

  const handleInputSubmit = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'farmer', text: input }];

    switch (step) {
      case 0:
        setFormData({ ...formData, user_goal: input });
        newMessages.push({ sender: 'agent', text: t('Where is your farm located? You can type the name or click 📍 Share Location.') });
        break;

      case 1:
        setFormData({ ...formData, region: input });
        newMessages.push({ sender: 'agent', text: t('How many acres of land and what is the water availability? (e.g., 2 acres, medium)') });
        break;

      case 2:
        const [acres, water] = input.split(',');
        setFormData({ ...formData, acres: acres?.trim(), water: water?.trim() });
        newMessages.push({ sender: 'agent', text: t('Which month are you planning for? (e.g., July or October)') });
        break;

      case 3:
        setFormData({ ...formData, month: input });
        newMessages.push({ sender: 'agent', text: t('Anything else we should know? (Optional)') });
        break;

      case 4:
        setFormData({ ...formData, context: input });
        newMessages.push({ sender: 'agent', text: t('Please select your preferred language:') });
        break;

      case 5:
        if (input.toLowerCase().includes('kn')) {
          setLang('kn');
          newMessages.push({ sender: 'agent', text: t('ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಯೋಜನೆ ತಯಾರಾಗುತ್ತಿದೆ...') });
        } else {
          setLang('en');
          newMessages.push({ sender: 'agent', text: t('Thank you! Preparing your seasonal plan...') });
        }
        setLoading(true);
        await handleSubmit();
        break;

      default:
        newMessages.push({
          sender: 'agent',
          text: t('Would you like help with anything else? You can also check the 📊 Market Trends page.')
        });
    }

    setMessages(newMessages);
    setInput('');
    setStep(step + 1);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData({ ...formData, lat: pos.coords.latitude, lon: pos.coords.longitude });
      setMessages([
        ...messages,
        {
          sender: 'agent',
          text: t('Location received ✅. Now tell me how many acres and water condition (e.g., 2 acres, medium)')
        }
      ]);
      setStep(2);
    });
  };

  return (
    <div className={styles.card}>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx} className={msg.sender === 'agent' ? styles.agentBubble : styles.userBubble}>
            {msg.text}
          </p>
        ))}
      </div>

      {!suggestion && (
        <>
          <input
            type="text"
            value={input}
            placeholder={t('Type your response...')}
            onChange={(e) => setInput(e.target.value)}
          />
          <SharedVoiceInput onResult={setInput} lang={lang} label={t('🎤 Speak')} />
          <button onClick={handleInputSubmit}>{t('Send')}</button>
          {step === 1 && <button onClick={handleShareLocation}>📍 {t('Share Location')}</button>}
        </>
      )}

      {loading && <p>🧠 {t('Planning your seasonal strategy...')}</p>}

      {suggestion && (
        <div className={styles.results}>
          <h3>🌾 {t('Crop Plan')}</h3>
          <div dangerouslySetInnerHTML={{ __html: suggestion.plan?.replace(/\n/g, '<br/>') }} />

          <h4>❤️ {t('Motivation')}</h4>
          <p>{suggestion.motivation}</p>

          <button onClick={() => window.location.href = '/market-trends'}>
            📊 {t('Check Market Trends')}
          </button>
        </div>
      )}
    </div>
  );
}








// 'use client';
// import { useState } from 'react';
// import styles from '@/styles/components/ConversationalCropAgent.module.css';
// import SharedVoiceInput from './SharedVoiceInput';

// export default function ConversationalCropAgent({ t }) {
//   const [messages, setMessages] = useState([
//     { sender: 'agent', text: t('Namaskara 🙏! I am your Krishi Assistant. How can I help you today?') }
//   ]);
//   const [formData, setFormData] = useState({
//     user_goal: '',
//     region: '',
//     lat: null,
//     lon: null,
//     acres: '',
//     water: '',
//     month: '',
//     context: '',
//     lang: 'en'
//   });
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [suggestion, setSuggestion] = useState(null);

//   const updateChat = (sender, text) => {
//     setMessages(prev => [...prev, { sender, text }]);
//   };

//   const getNextFieldFromGemini = async (history, formData, input) => {
//     const prompt = `
//   User said: "${input}"
//   Known farm info:
//   ${Object.entries(formData).map(([k,v]) => `${k}: ${v}`).join('\n')}
  
//   Based on this, what should the assistant ask next?
  
//   Respond in JSON:
//   {
//     "next_question": "...",
//     "field_to_fill": "..." // field in formData
//   }
//   `.trim();
  
//     try {
//       const res = await fetch("http://localhost:8000/gemini-convo-agent", {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt })
//       });
  
//       const data = await res.json();
  
//       // fallback if empty or wrong
//       if (!data.next_question || !data.field_to_fill) {
//         return {
//           next_question: "🙏 I couldn't understand that. Could you please clarify or give me your farm location, land size, or farming goal?",
//           field_to_fill: "context"
//         };
//       }
  
//       return data;
//     } catch (e) {
//       console.error("Gemini parse failed:", e);
//       return {
//         next_question: "🙏 I couldn't process that. Try typing again or share your farm region.",
//         field_to_fill: "context"
//       };
//     }
//   };
  

//   const handleSubmitToPlanner = async () => {
//     const form = new FormData();
//     Object.entries(formData).forEach(([k, v]) => form.append(k, v));
//     const res = await fetch('http://localhost:8000/seasonal-plan/', { method: 'POST', body: form });
//     const data = await res.json();
//     setSuggestion(data);
//     setLoading(false);
//   };

//   const handleInputSubmit = async () => {
//     if (!input.trim()) return;
//     updateChat('farmer', input);

//     const { next_question, field_to_fill } = await getNextFieldFromGemini(messages, formData, input);

//     if (formData.hasOwnProperty(field_to_fill)) {
//       setFormData(prev => ({ ...prev, [field_to_fill]: input }));
//     }

//     const filled = ['region', 'month', 'acres', 'water', 'lat', 'lon'];
//     const allFilled = filled.every(k => formData[k] || k === field_to_fill);
//     const hasGoal = formData.user_goal || field_to_fill === 'user_goal';

//     if (allFilled && hasGoal) {
//       setLoading(true);
//       updateChat('agent', t('Planning your seasonal strategy...'));
//       await handleSubmitToPlanner();
//     } else {
//       updateChat('agent', next_question || t('Please tell me more...'));
//     }

//     setInput('');
//   };

//   const handleShareLocation = async () => {
//     if (!navigator.geolocation) return alert('Geolocation not supported');
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       const lat = pos.coords.latitude;
//       const lon = pos.coords.longitude;
//       const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
//       const data = await res.json();
//       const place = data?.address?.city || data?.address?.state || data?.display_name || 'your area';

//       setFormData(prev => ({ ...prev, lat, lon }));
//       updateChat('agent', `📍 Location received: ${place}. Now tell me how many acres and water availability.`);
//     });
//   };

//   return (
//     <div className={styles.card}>
//       <div>
//         {messages.map((msg, idx) => (
//           <p key={idx} className={msg.sender === 'agent' ? styles.agentBubble : styles.userBubble}>
//             {msg.text}
//           </p>
//         ))}
//       </div>

//       {!suggestion && (
//         <>
//           <input
//             type="text"
//             value={input}
//             placeholder={t('Type your message...')}
//             onChange={(e) => setInput(e.target.value)}
//           />
//           <SharedVoiceInput onResult={setInput} lang={formData.lang} label={t('🎤 Speak')} />
//           <button onClick={handleInputSubmit}>{t('Send')}</button>
//           <button onClick={handleShareLocation}>📍 {t('Share Location')}</button>
//         </>
//       )}

//       {loading && <p>🧠 {t('Planning...')}</p>}

//       {suggestion && (
//         <div className={styles.results}>
//           <h3>🌾 {t('Your Crop Plan')}</h3>
//           <div dangerouslySetInnerHTML={{ __html: suggestion.plan.replace(/\n/g, '<br/>') }} />
//           <h4>❤️ {t('Motivation')}</h4>
//           <p>{suggestion.motivation}</p>
//           <button onClick={() => window.location.href = '/dashboard#market-trends'}>
//             📊 {t('Check Market Trends')}
//           </button>
//           <p>{t('Anything else I can help with?')}</p>
//         </div>
//       )}
//     </div>
//   );
// }

