// 'use client';
// import { useState } from 'react';

// export default function SharedVoiceInput({ onResult, lang = 'en', label = '🎤 Speak' }) {
//   const [recording, setRecording] = useState(false);

//   const handleVoiceInput = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert('Speech recognition not supported');
//       return;
//     }

//     const recognition = new webkitSpeechRecognition();
//     recognition.lang = lang === 'kn' ? 'kn-IN' : 'en-US';
//     recognition.interimResults = false;

//     recognition.onstart = () => setRecording(true);
//     recognition.onerror = () => setRecording(false);
//     recognition.onend = () => setRecording(false);

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       onResult(transcript);
//     };

//     recognition.start();
//   };

//   return (
//     <button onClick={handleVoiceInput}>
//       {recording ? '🎙️ Listening...' : label}
//     </button>
//   );
// }


'use client';
import { useState } from 'react';

export default function SharedVoiceInput({ onResult, lang = 'en', label = '🎤 Speak' }) {
  const [recording, setRecording] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = lang === 'kn' ? 'kn-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
  };

  return (
    <button onClick={handleVoiceInput}>
      {recording ? '🎙️ Listening...' : label}
    </button>
  );
}
