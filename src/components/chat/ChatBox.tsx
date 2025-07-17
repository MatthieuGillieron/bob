'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatBoxProps {
  project: string
}

export default function ChatBox({ project }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, project })
      })

      const data = await response.json()
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Erreur: ${data.error}` }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Erreur de connexion. Vérifiez votre clé OpenAI.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-4">Assistant IA - {project}</h2>
      
      <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-600">Posez vos questions sur {project}...</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${
                msg.role === 'user' 
                  ? 'bg-blue-100 ml-8' 
                  : 'bg-green-100 mr-8'
              }`}>
                <div className="text-xs text-gray-500 mb-1">
                  {msg.role === 'user' ? 'Vous' : 'Bob'}
                </div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="bg-green-100 mr-8 p-2 rounded">
                <div className="text-xs text-gray-500 mb-1">Bob</div>
                <div className="text-sm">Réflexion...</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Votre question..."
          className="flex-1 p-2 border rounded-lg"
          disabled={loading}
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}