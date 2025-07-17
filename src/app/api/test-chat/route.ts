import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé OpenAI manquante' }, { status: 500 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test simple' }],
        max_tokens: 50
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Erreur OpenAI', details: data }, { status: 500 })
    }

    return NextResponse.json({ success: true, response: data.choices[0].message.content })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur', details: error }, { status: 500 })
  }
}