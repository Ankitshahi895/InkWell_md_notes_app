import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

export function FileUpload({ onUpload, loading }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.endsWith('.md') && file.type !== 'text/markdown') {
      alert('Please upload a .md (Markdown) file.')
      return
    }
    setFileName(file.name)
    await onUpload(file)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const handleInputChange = e => {
    const file = e.target.files?.[0]
    handleFile(file)
    e.target.value = ''
  }

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ position: 'relative' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".md,text/markdown"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {loading ? (
            <Loader2 size={18} style={{ color: 'var(--accent-amber)', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Upload size={18} style={{ color: dragging ? 'var(--accent-amber)' : 'var(--text-muted)' }} />
          )}
          <div style={{ textAlign: 'left' }}>
            {fileName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={13} style={{ color: 'var(--accent-jade)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-jade)', fontWeight: 500 }}>{fileName}</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {loading ? 'Processing file…' : 'Drop a .md file or click to upload'}
              </span>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
