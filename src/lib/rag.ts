import { openai } from './openai'
import fs from 'fs'
import path from 'path'

interface Document {
  content: string
  metadata: {
    project: string
    section: string
  }
}

// Découper le texte en chunks
function chunkText(text: string, chunkSize: number = 500): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}

// Créer des embeddings
async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  })
  return response.data[0].embedding
}

// Calculer la similarité cosinus
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

// Charger et vectoriser le contenu d'un projet
export async function loadProjectContent(projectSlug: string): Promise<Document[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', `${projectSlug}.md`)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    const chunks = chunkText(content)
    const documents: Document[] = []
    
    for (let i = 0; i < chunks.length; i++) {
      documents.push({
        content: chunks[i],
        metadata: {
          project: projectSlug,
          section: `chunk_${i}`
        }
      })
    }
    
    return documents
  } catch (error) {
    console.error(`Erreur chargement projet ${projectSlug}:`, error)
    return []
  }
}

// Recherche sémantique
export async function semanticSearch(
  query: string, 
  projectSlug: string, 
  topK: number = 3
): Promise<string[]> {
  try {
    // Charger le contenu du projet
    const documents = await loadProjectContent(projectSlug)
    if (documents.length === 0) return []
    
    // Créer l'embedding de la requête
    const queryEmbedding = await createEmbedding(query)
    
    // Calculer les embeddings des documents et les scores
    const results = []
    for (const doc of documents) {
      const docEmbedding = await createEmbedding(doc.content)
      const similarity = cosineSimilarity(queryEmbedding, docEmbedding)
      results.push({ content: doc.content, similarity })
    }
    
    // Trier par similarité et retourner les top K
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(r => r.content)
      
  } catch (error) {
    console.error('Erreur recherche sémantique:', error)
    return []
  }
}