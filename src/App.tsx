import { APP_NAME } from '@/config/constants'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">{APP_NAME}</h1>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-gray-600">Plataforma pronta para desenvolvimento.</p>
      </main>
    </div>
  )
}

export default App
