'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN'
  phone?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginPhone: (phone: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  role?: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          const response = await api.get('/auth/me')
          if (response.data && response.data.user) {
            setUser(response.data.user)
          }
        } catch (error: any) {
          // Se o erro for 401 ou de rede, limpar token
          if (error.response?.status === 401 || error.code === 'ERR_NETWORK' || error.message?.includes('Failed to fetch')) {
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
            delete api.defaults.headers.common['Authorization']
            setUser(null)
          }
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login')
      throw error
    }
  }

  const loginPhone = async (phone: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { phone, password })
      const { user, token } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login')
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data)
      const { user, token } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      toast.success('Cadastro realizado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/')
    toast.success('Logout realizado com sucesso!')
  }

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginPhone, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

