import { useState, useEffect } from 'react'
import { Plus, LogOut, Search, FileText, Trash2, Moon, Sun, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useNotes } from '../../contexts/NotesContext'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const seconds = Math.floor((Date.now() - date) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function Sidebar({ selectedNoteId, onSelectNote, onNewNote, onDeleteNote }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const { notes, loading } = useNotes()
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const filtered = notes.filter(n =>
    (n.title || 'Untitled').toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    setDeletingId(id)
    await onDeleteNote(id)
    setDeletingId(null)
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'var(--accent-amber-soft)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>✦</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Inkwell
            </span>
          </div>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'background 0.2s',
            }}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent-amber), var(--accent-jade))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#0d0d22',
            flexShrink: 0,
          }}>
            {(user?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || 'User'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Free plan</div>
          </div>
        </div>
      </div>

      {/* New note button */}
      <div style={{ padding: '14px 16px 10px' }}>
        <button
          className="btn-primary"
          onClick={onNewNote}
          style={{ width: '100%', justifyContent: 'center', padding: '9px 16px' }}
        >
          <Plus size={15} /> New Note
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input-base"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes…"
            style={{ paddingLeft: 30, paddingTop: 7, paddingBottom: 7, fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Notes list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 10px' }}>
        <div style={{ padding: '0 6px 8px' }}>
          <span className="section-label">NOTES · {filtered.length}</span>
        </div>

        {loading ? (
          <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '20px 6px', textAlign: 'center' }}>
            <FileText size={28} style={{ color: 'var(--text-placeholder)', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              {search ? 'No notes match your search' : 'No notes yet. Create your first!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(note => (
              <div
                key={note.id}
                className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
                onClick={() => onSelectNote(note)}
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: '0.87rem', fontWeight: 500,
                    color: selectedNoteId === note.id ? 'var(--accent-amber)' : 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: 2,
                  }}>
                    {note.title || 'Untitled'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {timeAgo(note.updatedAt || note.createdAt)}
                    </span>
                    {note.content && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-placeholder)' }}>
                        {note.content.length} chars
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={e => handleDelete(e, note.id)}
                  disabled={deletingId === note.id}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', opacity: 0.5, padding: '2px',
                    display: 'flex', borderRadius: 5, transition: 'opacity 0.15s, color 0.15s',
                    flexShrink: 0, marginTop: 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--accent-rose)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = 'var(--text-muted)' }}
                  title="Delete note"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div style={{ padding: '12px 16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={logout}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  )
}
