import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer les notes d'un projet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const project = searchParams.get('project')
    const userId = searchParams.get('userId') || 'demo-user'

    if (!project) {
      return NextResponse.json({ error: 'Projet requis' }, { status: 400 })
    }

    const notes = await prisma.note.findMany({
      where: {
        userId,
        project: { slug: project }
      },
      include: {
        project: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Erreur récupération notes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une nouvelle note
export async function POST(request: NextRequest) {
  try {
    const { title, content, project, userId = 'demo-user' } = await request.json()

    if (!title || !content || !project) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Créer ou récupérer le projet
    const projectRecord = await prisma.project.upsert({
      where: { slug: project },
      update: {},
      create: {
        name: project,
        slug: project,
        description: `Projet ${project}`,
        content: ''
      }
    })

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        projectId: projectRecord.id
      }
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Erreur création note:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}