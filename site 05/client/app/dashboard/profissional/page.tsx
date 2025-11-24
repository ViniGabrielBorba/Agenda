'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import ThemeToggle from '@/components/ThemeToggle'

interface Appointment {
  id: string
  startTime: string
  endTime: string
  status: string
  service: {
    name: string
    price: number
  }
  client: {
    name: string
    email: string
    phone?: string
  }
}

interface Stats {
  appointments: {
    total: number
    pending: number
    confirmed: number
    completed: number
  }
  revenue: {
    total: number
  }
}

export default function ProfissionalDashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && user.role === 'CLIENT') {
      router.push('/dashboard/cliente')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        api.get('/appointments').catch(() => ({ data: [] })),
        api.get('/reports/stats').catch(() => ({ data: null }))
      ])
      setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [])
      setStats(statsRes.data)
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      // Não mostrar toast para evitar spam de erros
      setAppointments([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status })
      toast.success('Status atualizado')
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700 dark:border-brown-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-soft">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-brown-200 dark:border-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center shadow-elegant mr-3">
                <span className="text-white text-xl font-bold font-display">FG</span>
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-brown-700 to-brown-800 dark:from-brown-500 dark:to-brown-600 bg-clip-text text-transparent">
                FlowGest
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/servicos" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                💅 Serviços
              </Link>
              <Link href="/horarios" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ⏰ Horários
              </Link>
              <Link href="/analytics" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                📊 Analytics
              </Link>
              <Link href="/relatorios" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                📈 Relatórios
              </Link>
              <Link href="/avaliacoes" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ⭐ Avaliações
              </Link>
              <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                📸 Portfólio
              </Link>
              <Link href="/perfil" className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                👤 Perfil
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 dark:text-gray-300 hover:text-brown-700 dark:hover:text-brown-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Agendamentos</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.appointments.total}</p>
                </div>
                <div className="w-12 h-12 bg-brown-200 dark:bg-brown-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </div>
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendentes</h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.appointments.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmados</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.appointments.confirmed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Receita Total</h3>
                  <p className="text-3xl font-bold text-brown-700 dark:text-brown-500 mt-2">
                    R$ {stats.revenue.total.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center shadow-soft">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Agendamentos</h2>

        {appointments.length === 0 ? (
          <div className="card-elegant p-12 text-center">
            <div className="w-24 h-24 gradient-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant">
              <span className="text-5xl">💅</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Nenhum agendamento ainda</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Os agendamentos aparecerão aqui quando seus clientes agendarem</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="card-elegant p-6 hover:shadow-elegant transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center shadow-soft">
                        <span className="text-2xl">💅</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{appointment.service.name}</h3>
                        <p className="text-sm text-brown-700 font-medium">👤 {appointment.client.name}</p>
                      </div>
                    </div>
                    <div className="ml-16 space-y-2">
                      <p className="text-sm text-gray-600">{appointment.client.email}</p>
                      {appointment.client.phone && (
                        <p className="text-sm text-gray-600">📱 {appointment.client.phone}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        📅 {format(new Date(appointment.startTime), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-lg font-bold text-brown-700">
                        R$ {appointment.service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {appointment.status === 'CONFIRMED' ? '✅ Confirmado' :
                       appointment.status === 'PENDING' ? '⏳ Pendente' :
                       appointment.status === 'COMPLETED' ? '✨ Concluído' :
                       '❌ Cancelado'}
                    </span>
                    {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                      <div className="mt-4 flex flex-col space-y-2">
                        {appointment.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(appointment.id, 'CONFIRMED')}
                            className="text-sm text-green-700 hover:text-green-800 font-medium px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
                          >
                            ✅ Confirmar
                          </button>
                        )}
                        {appointment.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateStatus(appointment.id, 'COMPLETED')}
                            className="text-sm text-blue-700 hover:text-blue-800 font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                          >
                            ✨ Concluir
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(appointment.id, 'CANCELLED')}
                          className="text-sm text-red-700 hover:text-red-800 font-medium px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

