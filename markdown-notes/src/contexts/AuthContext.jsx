import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('inkwell_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { token, ...userData } = data
      localStorage.setItem('inkwell_token', token)
      localStorage.setItem('inkwell_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { email, password })
      const { token, ...userData } = data
      localStorage.setItem('inkwell_token', token)
      localStorage.setItem('inkwell_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('inkwell_token')
    localStorage.removeItem('inkwell_user')
    setUser(null)
  }, [])

  const isAuthenticated = !!user && !!localStorage.getItem('inkwell_token')

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
