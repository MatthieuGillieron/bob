import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Bob
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Assistant intelligent pour les étudiants de 42. 
            Accompagne ton apprentissage du Common Core avec l'IA.
          </p>
          <div className="space-x-4">
            <Link 
              href="/auth/signin"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}