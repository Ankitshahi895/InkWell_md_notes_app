import { useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '../components/dashboard/Sidebar'
import { NoteEditor } from '../components/editor/NoteEditor'
import { MarkdownPreview } from '../components/editor/MarkdownPreview'
import { Toast } from '../components/ui/Toast'
import { useNotes } from '../contexts/NotesContext'
import { useToast } from '../hooks/useToast'

export default function DashboardPage() {
  const {
    notes, loading: notesLoading,
    fetchNotes, createNote, updateNote, deleteNote,
    uploadMarkdown, checkGrammar,
  } = useNotes()
  const { toasts, addToast, removeToast } = useToast()

  const [selectedNote, setSelectedNote] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const resetEditor = useCallback(() => {
    setSelectedNote(null)
    setTitle('')
    setContent('')
  }, [])

  const handleSelectNote = useCallback((note) => {
    setSelectedNote(note)
    setTitle(note.title || '')
    setContent(note.content || '')
    setSidebarOpen(false)
  }, [])

  const handleNewNote = useCallback(() => {
    resetEditor()
    setSidebarOpen(false)
  }, [resetEditor])

  const handleSave = async () => {
    if (!title.trim()) { addToast('Please add a title', 'error'); return }
    setSaving(true)
    try {
      const newNote = await createNote({ title: title.trim(), content })
      setSelectedNote(newNote)
      addToast('Note created!', 'success')
    } catch {
      addToast('Failed to save note', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedNote?.id) { handleSave(); return }
    if (!title.trim()) { addToast('Please add a title', 'error'); return }
    setSaving(true)
    try {
      const updated = await updateNote(selectedNote.id, { title: title.trim(), content })
      setSelectedNote(updated)
      addToast('Note updated!', 'success')
    } catch {
      addToast('Failed to update note', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedNote?.id) return
    if (!window.confirm(`Delete "${title || 'Untitled'}"?`)) return
    setDeleting(true)
    try {
      await deleteNote(selectedNote.id)
      resetEditor()
      addToast('Note deleted', 'success')
    } catch {
      addToast('Failed to delete note', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleSidebarDelete = async (id) => {
    try {
      await deleteNote(id)
      if (selectedNote?.id === id) resetEditor()
      addToast('Note deleted', 'success')
    } catch {
      addToast('Failed to delete note', 'error')
    }
  }

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const data = await uploadMarkdown(file)
      addToast('File loaded into editor!', 'success')
      return data
    } catch {
      addToast('Failed to process file', 'error')
      return null
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      position: 'relative',
    }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
            display: 'none',
          }}
          className="md:hidden-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'relative',
        zIndex: 50,
        flexShrink: 0,
      }} className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}>
        <Sidebar
          selectedNoteId={selectedNote?.id}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onDeleteNote={handleSidebarDelete}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
        {/* Mobile top bar */}
        <div style={{
          display: 'none',
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 52, background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-subtle)',
          alignItems: 'center', padding: '0 16px', gap: 12, zIndex: 30,
        }} className="mobile-topbar">
          <button
            onClick={() => setSidebarOpen(s => !s)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>Inkwell</span>
        </div>

        {/* Editor panel */}
        <div style={{
          flex: '0 0 50%',
          minWidth: 0,
          borderRight: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }} className="editor-panel">
          <NoteEditor
            note={selectedNote}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            onSave={handleSave}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onUpload={handleUpload}
            onGrammarCheck={checkGrammar}
            saving={saving}
            deleting={deleting}
            uploading={uploading}
          />
        </div>

        {/* Preview panel */}
        <div style={{
          flex: '0 0 50%',
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }} className="preview-panel">
          <MarkdownPreview content={content} title={title} />
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed !important;
            left: -280px;
            top: 0;
            bottom: 0;
            transition: left 0.3s ease;
          }
          .sidebar-wrapper.sidebar-mobile-open {
            left: 0;
          }
          .mobile-topbar {
            display: flex !important;
          }
          .editor-panel {
            flex: 0 0 100% !important;
            padding-top: 52px;
          }
          .preview-panel {
            display: none !important;
          }
          .md\\:hidden-overlay {
            display: block !important;
          }
        }
        @media (max-width: 1100px) and (min-width: 769px) {
          .preview-panel {
            flex: 0 0 40% !important;
          }
          .editor-panel {
            flex: 0 0 60% !important;
          }
        }
      `}</style>
    </div>
  )
}
