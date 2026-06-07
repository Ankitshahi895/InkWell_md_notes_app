import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="auth-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo top-left */}
      <div style={{ position: 'absolute', top: 28, left: 32 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-amber)', letterSpacing: '-0.02em' }}>
          ✦ Inkwell
        </span>
      </div>

      <div className="auth-card animate-slide-up" style={{ width: '100%', maxWidth: 420, padding: '40px 40px 36px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--accent-amber-soft)',
            border: '1px solid rgba(245,158,11,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: '1.25rem' }}>✦</span>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to your Inkwell workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 7, fontFamily: 'Syne, sans-serif', letterSpacing: '0.03em' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                className="input-base"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{ paddingLeft: 36 }}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 7, fontFamily: 'Syne, sans-serif', letterSpacing: '0.03em' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                className="input-base"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ paddingLeft: 36, paddingRight: 40 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'var(--accent-rose-soft)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: 'var(--accent-rose)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px 20px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</>
            ) : (
              <>Sign in <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 28, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          No account yet?{' '}
          <Link to="/register" style={{ color: 'var(--accent-amber)', textDecoration: 'none', fontWeight: 500 }}>
            Create one free
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
