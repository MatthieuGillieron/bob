import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { loadProjectContent } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { project, notes } = await request.json()
    
    // Récupérer le contenu du projet
    const projectContent = await loadProjectContent(project === 'ft_printf' ? 'ft_printf_extended' : project)
    const projectText = projectContent.map(doc => doc.content).join('\n\n')
    
    // Préparer le contenu des notes
    const notesText = notes.map((note: any) => `${note.title}: ${note.content}`).join('\n\n')
    
    const prompt = `Génère exactement 5 questions de quiz sur le projet ${project}.

CONTENU DU PROJET:
${projectText}

NOTES DE L'ÉTUDIANT:
${notesText}

RÈGLES:
- Questions variées: concepts, définitions, cas pratiques
- 4 options par question (A, B, C, D)
- 1 seule bonne réponse
- Explication courte pour chaque réponse
- Format JSON strict

EXEMPLE DE FORMAT:
{
  "questions": [
    {
      "id": "1",
      "question": "Que fait va_start() ?",
      "options": ["Initialise la liste d'arguments", "Ferme la liste", "Lit un argument", "Compte les arguments"],
      "correctAnswer": 0,
      "explanation": "va_start() initialise le pointeur pour accéder aux arguments variables"
    }
  ]
}

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    })

    const response = completion.choices[0].message.content
    
    try {
      const quizData = JSON.parse(response || '{}')
      return NextResponse.json(quizData)
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError)
      return NextResponse.json({ error: 'Erreur format réponse' }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Erreur génération quiz:', error)
    return NextResponse.json({ error: 'Erreur génération quiz' }, { status: 500 })
  }
}