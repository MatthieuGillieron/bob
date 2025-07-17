import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content } = await request.json()
    const { id } = params

    const note = await prisma.note.update({
      where: { id },
      data: { title, content }
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Erreur modification note:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.note.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression note:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}