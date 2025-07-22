'use client'
import LanguageSelector from '../components/LanguageSelector'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Project Kisan</h1>
          <p className="text-green-600">Please select your preferred language</p>
        </div>
        <LanguageSelector />
      </div>
    </div>
  )
}