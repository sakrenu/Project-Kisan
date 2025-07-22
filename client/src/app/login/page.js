import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Project Kisan</h1>
        <p className="text-lg text-gray-600 mb-6">Smart Farming for Indian Farmers</p>
        <div className="flex flex-col space-y-4 mb-6">
          <Link href="/dashboard">
            <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-white text-green-600 font-semibold py-2 px-6 rounded-lg border border-green-600 hover:bg-green-50 transition">
              Create Account
            </button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-green-600 hover:underline">Terms</a> and{' '}
          <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>
        </p>
        <p className="text-sm text-gray-600">
          Supported by <span className="font-semibold">Ministry of Agriculture & Farmers&apos; Welfare</span>
        </p>
      </div>
    </div>
  );
}