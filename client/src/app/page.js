import LanguageSelector from '../components/LanguageSelector';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Project Kisan</h1>
        <p className="text-lg text-gray-600 mb-6">Please select your preferred language</p>
        <LanguageSelector />
      </div>
    </div>
  );
}