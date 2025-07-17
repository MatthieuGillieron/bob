'use client'

import { useState } from 'react'
import { Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizGeneratorProps {
  project: string
}

export default function QuizGenerator({ project }: QuizGeneratorProps) {
  const [quiz, setQuiz] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const generateQuiz = async () => {
    setLoading(true)
    try {
      const savedNotes = localStorage.getItem(`notes_${project}`)
      const notes = savedNotes ? JSON.parse(savedNotes) : []
      
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, notes })
      })

      const data = await response.json()
      
      if (data.questions) {
        setQuiz(data.questions)
        setCurrentQuestion(0)
        setUserAnswers([])
        setShowResults(false)
        setQuizStarted(true)
      }
    } catch (error) {
      console.error('Erreur génération quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const answerQuestion = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quiz[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setUserAnswers([])
    setShowResults(false)
    setQuizStarted(false)
  }

  if (!quizStarted) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Quiz - {project}</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Générez un quiz personnalisé basé sur vos notes et le contenu du projet
          </p>
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            <Play size={16} />
            {loading ? 'Génération...' : 'Générer un quiz'}
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / quiz.length) * 100)
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Résultats du Quiz</h2>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold mb-2">
            {score}/{quiz.length}
          </div>
          <div className={`text-lg ${percentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
            {percentage}% de réussite
          </div>
        </div>

        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {quiz.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4">
              <p className="font-medium mb-2">{question.question}</p>
              <div className="space-y-1">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded text-sm ${
                      optIndex === question.correctAnswer
                        ? 'bg-green-100 text-green-800'
                        : optIndex === userAnswers[index]
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {optIndex === question.correctAnswer && <CheckCircle size={16} />}
                      {optIndex === userAnswers[index] && optIndex !== question.correctAnswer && <XCircle size={16} />}
                      {option}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">
                {question.explanation}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={resetQuiz}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Nouveau quiz
        </button>
      </div>
    )
  }

  const question = quiz[currentQuestion]
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Quiz - {project}</h2>
        <span className="text-sm text-gray-500">
          {currentQuestion + 1}/{quiz.length}
        </span>
      </div>

      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          />
        </div>
        
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
        
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => answerQuestion(index)}
              className="w-full p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}