import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Eye } from 'lucide-react'

export function MarkdownPreview({ content, title }) {
  const isEmpty = !content || content.trim() === ''

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
          background: 'var(--accent-jade-soft)',
          border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Eye size={13} style={{ color: 'var(--accent-jade)' }} />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Preview
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 4 }}>Live</span>
        <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-jade)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {isEmpty ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={22} style={{ color: 'var(--text-placeholder)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                Nothing to preview
              </p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-placeholder)' }}>
                Start typing in the editor to see your markdown rendered
              </p>
            </div>
          </div>
        ) : (
          <article className="markdown-preview">
            {title && <h1>{title}</h1>}
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {content}
            </ReactMarkdown>
          </article>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
    </div>
  )
}
