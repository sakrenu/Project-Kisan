// // client/src/app/seasonal-planner/page.js

// 'use client';
// import CropPlannerCard from '@/components/CropPlannerCard';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import { useTranslation } from 'react-i18next';

// export default function SeasonalPlannerPage() {
//   const { t } = useTranslation();

//   return (
//     <div>
//       <Navbar />
//       <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
//         <CropPlannerCard t={t} />
//       </main>
//       <Footer t={t} />
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConversationalCropAgent from '@/components/ConversationalCropAgent';
import SmartCropPlannerForm from '@/components/SmartCropPlannerForm';
import { useTranslation } from 'react-i18next';

export default function SeasonalPlannerPage() {
  const [mode, setMode] = useState('chat');
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button onClick={() => setMode(mode === 'chat' ? 'form' : 'chat')}>
            {mode === 'chat' ? '🔄 Switch to Form Mode' : '💬 Switch to Conversational Mode'}
          </button>
        </div>
        {mode === 'chat' ? <ConversationalCropAgent t={t} /> : <SmartCropPlannerForm t={t} />}
      </main>
      <Footer t={t} />
    </>
  );
}
