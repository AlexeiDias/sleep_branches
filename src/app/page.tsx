// src/app/page.tsx

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-10 text-center">
      <div className="max-w-xl">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Welcome to SleepBranches 🍼</h1>
        <p className="text-lg text-gray-700 mb-8">
          Simplify your home daycare with smart logs for sleep, diapers, meals, bottles, and daily reports. 
          Built for compliance. Designed for care. 💙
        </p>

        <div className="flex justify-center space-x-4">
          <a
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Register
          </a>
          <a
            href="/login"
            className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
