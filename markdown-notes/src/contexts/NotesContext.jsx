import { createContext, useContext, useState, useCallback } from 'react'
import api from '../lib/api'

const NotesContext = createContext(null)

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/notes')
      setNotes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [])

  const getNote = useCallback(async (id) => {
    const { data } = await api.get(`/notes/${id}`)
    return data
  }, [])

  const createNote = useCallback(async (noteData) => {
    const { data } = await api.post('/notes', noteData)
    setNotes(prev => [data, ...prev])
    return data
  }, [])

  const updateNote = useCallback(async (id, noteData) => {
    const { data } = await api.put(`/notes/${id}`, noteData)
    setNotes(prev => prev.map(n => n.id === id ? data : n))
    return data
  }, [])

  const deleteNote = useCallback(async (id) => {
    await api.delete(`/notes/${id}`)
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  const uploadMarkdown = useCallback(async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/notes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }, [])

  const renderMarkdown = useCallback(async (content) => {
    const { data } = await api.post('/notes/render', { content })
    return data
  }, [])

  const checkGrammar = useCallback(async (content) => {
    const { data } = await api.post('/notes/grammar', { content })
    return data
  }, [])

  return (
    <NotesContext.Provider value={{
      notes, loading, error,
      fetchNotes, getNote,
      createNote, updateNote, deleteNote,
      uploadMarkdown, renderMarkdown, checkGrammar
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
