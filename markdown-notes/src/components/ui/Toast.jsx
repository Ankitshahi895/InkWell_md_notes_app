import { CheckCircle2, XCircle, X } from 'lucide-react'

export function Toast({ toasts, removeToast }) {
  if (!toasts.length) return null

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={16} />
            : <XCircle size={16} />
          }
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'inherit', opacity: 0.7 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
