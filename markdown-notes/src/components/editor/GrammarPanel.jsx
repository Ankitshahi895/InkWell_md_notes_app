import { AlertTriangle, X, Lightbulb, CheckCircle2 } from 'lucide-react'

export function GrammarPanel({ results, onClose, onApplySuggestion }) {
  if (!results) return null

  const issues = results.issues || results.errors || results.matches || []
  const hasIssues = issues.length > 0

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasIssues ? (
            <AlertTriangle size={15} style={{ color: 'var(--accent-amber)' }} />
          ) : (
            <CheckCircle2 size={15} style={{ color: 'var(--accent-jade)' }} />
          )}
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            Grammar Check
          </span>
          {hasIssues && (
            <span style={{
              background: 'var(--accent-amber-soft)',
              color: 'var(--accent-amber)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 20, padding: '1px 8px', fontSize: '0.72rem', fontWeight: 600,
            }}>
              {issues.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', borderRadius: 6, padding: 2 }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px', maxHeight: 260, overflowY: 'auto' }}>
        {!hasIssues ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <CheckCircle2 size={30} style={{ color: 'var(--accent-jade)', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              No grammar issues found!
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Your text looks great.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {issues.map((issue, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <AlertTriangle size={13} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {issue.message || issue.description || issue.text}
                  </p>
                </div>

                {/* Suggestions */}
                {(issue.suggestions || issue.replacements || []).length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <Lightbulb size={11} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Suggestions
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {(issue.suggestions || issue.replacements || []).slice(0, 4).map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          className="grammar-chip"
                          onClick={() => onApplySuggestion?.(issue, sug?.value || sug)}
                          title="Click to apply suggestion"
                        >
                          {sug?.value || sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context */}
                {(issue.context || issue.sentence) && (
                  <div style={{ marginTop: 8, padding: '5px 8px', background: 'var(--bg-card)', borderRadius: 6, borderLeft: '2px solid var(--accent-amber)' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                      {issue.context || issue.sentence}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
