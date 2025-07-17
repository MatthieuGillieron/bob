import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPT } from '@/lib/openai'
import { semanticSearch } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { message, project } = await request.json()
    
    // Recherche sémantique dans le contenu du projet
    const relevantContent = await semanticSearch(message, project === 'ft_printf' ? 'ft_printf_extended' : project, 2)
    
    // Construire le contexte enrichi
    const contextualPrompt = `${SYSTEM_PROMPT}\n\nProjet actuel: ${project}\n\nContexte pertinent du projet:\n${relevantContent.join('\n\n')}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contextualPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
    
    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Erreur chat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la réponse' },
      { status: 500 }
    )
  }
}