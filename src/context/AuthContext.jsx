import { useEffect, useMemo, useState } from 'react'
import api from '../services/api.js'
import AuthContext from './authContext.js'

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('libmanager_token') || '')
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('libmanager_user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('libmanager_token', token)
    } else {
      localStorage.removeItem('libmanager_token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('libmanager_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('libmanager_user')
    }
  }, [user])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        setToken(response.data.token)
        setUser(response.data.usuario)
        return response.data
      },
      logout() {
        setToken('')
        setUser(null)
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider }
