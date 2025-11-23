'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'

interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  avatar?: string
  createdAt: string
}

export default function PerfilPage() {
  const { user, loading: authLoading, updateUser } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      fetchProfile()
    }
  }, [user, authLoading, router])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile')
      setProfile(response.data)
      setFormData({
        name: response.data.name || '',
        phone: response.data.phone || '',
        avatar: response.data.avatar || ''
      })
    } catch (error) {
      toast.error('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.put('/users/profile', formData)
      setProfile(response.data.user)
      updateUser(response.data.user)
      setEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast.success('Senha alterada com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen gradient-soft">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center shadow-elegant mr-3">
                <span className="text-white text-xl font-bold font-display">FG</span>
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FlowGest
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <BackButton href={user?.role === 'CLIENT' ? '/dashboard/cliente' : '/dashboard/profissional'} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-elegant p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">Informações Pessoais</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="gradient-pink text-white px-6 py-2 rounded-xl hover:shadow-elegant transition-all font-semibold"
              >
                ✏️ Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar (URL)
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://exemplo.com/avatar.jpg"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="gradient-pink text-white px-6 py-3 rounded-xl hover:shadow-elegant transition-all font-semibold"
                >
                  💾 Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      name: profile.name || '',
                      phone: profile.phone || '',
                      avatar: profile.avatar || ''
                    })
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
                <p className="text-gray-900">{profile.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{profile.email}</p>
              </div>
              {profile.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Conta</label>
                <p className="text-gray-900">
                  {profile.role === 'CLIENT' ? 'Cliente' : 
                   profile.role === 'PROFESSIONAL' ? 'Profissional' : 
                   'Administrador'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Membro desde</label>
                <p className="text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alterar Senha</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Alterar Senha
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

