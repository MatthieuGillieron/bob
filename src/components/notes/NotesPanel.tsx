'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit3, Plus } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  project: string
  createdAt: string
}

interface NotesPanelProps {
  project: string
}

export default function NotesPanel({ project }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })

  // Charger les notes depuis localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${project}`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [project])

  // Sauvegarder les notes dans localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    localStorage.setItem(`notes_${project}`, JSON.stringify(updatedNotes))
  }

  // Créer une nouvelle note
  const createNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      project,
      createdAt: new Date().toISOString()
    }

    saveNotes([...notes, note])
    setNewNote({ title: '', content: '' })
    setIsCreating(false)
  }

  // Supprimer une note
  const deleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id))
  }

  // Modifier une note
  const updateNote = (id: string, title: string, content: string) => {
    saveNotes(notes.map(note => 
      note.id === id ? { ...note, title, content } : note
    ))
    setEditingId(null)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Mes Notes - {project}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {/* Formulaire de création */}
        {isCreating && (
          <div className="border-2 border-blue-200 rounded-lg p-3">
            <input
              type="text"
              placeholder="Titre de la note..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Contenu de la note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full p-2 border rounded mb-2 h-20 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={createNote}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewNote({ title: '', content: '' })
                }}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des notes */}
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isEditing={editingId === note.id}
            onEdit={() => setEditingId(note.id)}
            onSave={(title, content) => updateNote(note.id, title, content)}
            onCancel={() => setEditingId(null)}
            onDelete={() => deleteNote(note.id)}
          />
        ))}

        {notes.length === 0 && !isCreating && (
          <p className="text-gray-500 text-center py-8">
            Aucune note pour ce projet
          </p>
        )}
      </div>
    </div>
  )
}

// Composant pour une note individuelle
function NoteItem({ 
  note, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete 
}: {
  note: Note
  isEditing: boolean
  onEdit: () => void
  onSave: (title: string, content: string) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)

  if (isEditing) {
    return (
      <div className="border-2 border-orange-200 rounded-lg p-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded mb-2 h-20 resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSave(editTitle, editContent)}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Sauvegarder
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm">{note.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(note.createdAt).toLocaleDateString('fr-FR')}
      </p>
    </div>
  )
}