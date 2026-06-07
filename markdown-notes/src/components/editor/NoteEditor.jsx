import { useState, useCallback } from 'react'
import { Save, RefreshCw, Trash2, Loader2, Wand2, Edit3 } from 'lucide-react'
import { FileUpload } from './FileUpload'
import { GrammarPanel } from './GrammarPanel'

export function NoteEditor({
  note,
  title, setTitle,
  content, setContent,
  onSave, onUpdate, onDelete,
  onUpload, onGrammarCheck,
  saving, deleting, uploading,
}) {
  const [grammarResults, setGrammarResults] = useState(null)
  const [grammarLoading, setGrammarLoading] = useState(false)

  const isEditing = !!note?.id

  const handleGrammar = async () => {
    if (!content.trim()) return
    setGrammarLoading(true)
    try {
      const results = await onGrammarCheck(content)
      setGrammarResults(results)
    } catch {
      setGrammarResults({ issues: [] })
    } finally {
      setGrammarLoading(false)
    }
  }

  const handleUpload = async (file) => {
    const data = await onUpload(file)
    if (data?.content) setContent(data.content)
    if (data?.title) setTitle(data.title)
  }

  const handleTabKey = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newVal = content.substring(0, start) + '  ' + content.substring(end)
      setContent(newVal)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      })
    }
  }, [content, setContent])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'var(--accent-amber-soft)',
          border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Edit3 size={13} style={{ color: 'var(--accent-amber)' }} />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {isEditing ? 'Edit Note' : 'New Note'}
        </span>
        {isEditing && (
          <span style={{
            marginLeft: 4, fontSize: '0.7rem', padding: '2px 8px',
            background: 'var(--accent-jade-soft)', color: 'var(--accent-jade)',
            borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)', fontWeight: 500,
          }}>
            Editing
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 20px' }}>
        {/* Upload */}
        <div style={{ marginBottom: 14, flexShrink: 0 }}>
          <FileUpload onUpload={handleUpload} loading={uploading} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14, flexShrink: 0 }}>
          <input
            className="input-base"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title…"
            style={{ fontSize: '1.05rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, padding: '10px 14px' }}
          />
        </div>

        {/* Editor area */}
        <div style={{
          flex: 1, overflow: 'hidden',
          background: 'var(--bg-secondary)',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          display: 'flex', flexDirection: 'column',
          marginBottom: 14,
          transition: 'border-color 0.2s',
          minHeight: 0,
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          {/* Editor toolbar hint */}
          <div style={{ padding: '6px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-placeholder)', fontFamily: 'JetBrains Mono, monospace' }}>
              # Heading · **bold** · *italic* · `code` · [link](url)
            </span>
          </div>
          <textarea
            className="editor-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleTabKey}
            placeholder="Start writing your markdown note here…

# Hello World

Write something *amazing*."
            style={{ flex: 1, padding: '14px', resize: 'none', minHeight: 0 }}
          />
        </div>

        {/* Grammar panel */}
        {grammarResults && (
          <div style={{ marginBottom: 14, flexShrink: 0 }}>
            <GrammarPanel
              results={grammarResults}
              onClose={() => setGrammarResults(null)}
            />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {/* Grammar check */}
          <button
            className="btn-jade"
            onClick={handleGrammar}
            disabled={grammarLoading || !content.trim()}
          >
            {grammarLoading
              ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Checking…</>
              : <><Wand2 size={13} /> Grammar</>
            }
          </button>

          <div style={{ flex: 1 }} />

          {/* Delete (only when editing) */}
          {isEditing && (
            <button
              className="btn-danger"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting
                ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Deleting…</>
                : <><Trash2 size={13} /> Delete</>
              }
            </button>
          )}

          {/* Save / Update */}
          {isEditing ? (
            <button
              className="btn-secondary"
              onClick={onUpdate}
              disabled={saving || !title.trim()}
            >
              {saving
                ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                : <><RefreshCw size={13} /> Update</>
              }
            </button>
          ) : null}

          <button
            className="btn-primary"
            onClick={isEditing ? onUpdate : onSave}
            disabled={saving || !title.trim()}
            style={{ minWidth: 100 }}
          >
            {saving
              ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={13} /> {isEditing ? 'Save Changes' : 'Save Note'}</>
            }
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
