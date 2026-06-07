import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const passwordStrength = (pw) => {
    if (!pw) return 0
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = passwordStrength(form.password)
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#fb7185', '#fbbf24', '#a3e635', '#34d399']

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const result = await register(form.email, form.password)
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
      <div style={{ position: 'absolute', top: 28, left: 32 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-amber)', letterSpacing: '-0.02em' }}>
          ✦ Inkwell
        </span>
      </div>

      <div className="auth-card animate-slide-up" style={{ width: '100%', maxWidth: 420, padding: '40px 40px 36px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--accent-jade-soft)',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <CheckCircle2 size={22} color="var(--accent-jade)" />
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
            Create account
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Start your markdown journey with Inkwell
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
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= strength ? strengthColors[strength] : 'var(--border-default)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 7, fontFamily: 'Syne, sans-serif', letterSpacing: '0.03em' }}>
              CONFIRM PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                className="input-base"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  paddingLeft: 36, paddingRight: 40,
                  borderColor: form.confirmPassword && form.confirmPassword !== form.password ? 'var(--accent-rose)' : undefined,
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword === form.password && (
              <p style={{ marginTop: 5, fontSize: '0.78rem', color: 'var(--accent-jade)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> Passwords match
              </p>
            )}
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
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px 20px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
            ) : (
              <>Create account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-amber)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
