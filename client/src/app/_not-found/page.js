export default function NotFound() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
        <a href="/" className="mt-4 text-green-600 hover:underline">Return to Home</a>
      </div>
    );
  }