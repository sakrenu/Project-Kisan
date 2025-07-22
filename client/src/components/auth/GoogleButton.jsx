'use client'
import { signIn } from 'next-auth/react'

export default function GoogleButton() {
  return (
    <button 
      onClick={() => signIn('google')}
      className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-lg flex items-center justify-center"
    >
      <i className="fab fa-google mr-2"></i>
      Continue with Google
    </button>
  )
}