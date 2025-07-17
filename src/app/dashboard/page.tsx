'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState('ft_printf')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') return <div>Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Bob Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Bonjour, {session?.user?.name || session?.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sélecteur de projet */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Projet actuel</h2>
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="ft_printf">ft_printf</option>
                <option value="get_next_line">get_next_line</option>
                <option value="libft">libft</option>
              </select>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Progression</h3>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                </div>
                <p className="text-sm text-blue-700 mt-1">33% complété</p>
              </div>
            </div>
          </div>

          {/* Zone principale */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chat IA */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Assistant IA</h2>
                <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                  <p className="text-gray-600">Posez vos questions sur {selectedProject}...</p>
                </div>
                <input 
                  type="text" 
                  placeholder="Votre question..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Mes Notes</h2>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Comprendre printf</h3>
                    <p className="text-sm text-gray-600">Notes sur les spécificateurs...</p>
                  </div>
                  <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400">
                    + Nouvelle note
                  </button>
                </div>
              </div>

              {/* Quiz */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Quiz</h2>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                  Générer un quiz sur {selectedProject}
                </button>
              </div>

              {/* Ressources */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Ressources</h2>
                <div className="space-y-2">
                  <a href="#" className="block p-2 text-blue-600 hover:bg-blue-50 rounded">
                    📖 Man page printf
                  </a>
                  <a href="#" className="block p-2 text-blue-600 hover:bg-blue-50 rounded">
                    🎥 Vidéo explicative
                  </a>
                  <a href="#" className="block p-2 text-blue-600 hover:bg-blue-50 rounded">
                    📝 Sujet officiel
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}