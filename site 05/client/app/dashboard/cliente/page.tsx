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
  professional: {
    name: string
  }
  payment?: {
    status: string
  }
}

export default function ClienteDashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'CLIENT') {
      router.push('/dashboard/profissional')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && !authLoading) {
      fetchAppointments()
    }
  }, [user, authLoading])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await api.get('/appointments')
      setAppointments(Array.isArray(response.data) ? response.data : [])
    } catch (error: any) {
      console.error('Erro ao carregar agendamentos:', error)
      // Se for erro 401, redirecionar para login
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      // Não mostrar erro se for apenas "sem agendamentos" ou se for 404
      // Apenas logar o erro, não mostrar toast para evitar spam
      if (error.response?.status && error.response.status !== 404 && error.response.status !== 401) {
        console.log('Erro ao buscar agendamentos:', error.response?.data || error.message)
      }
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (id: string) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return

    try {
      await api.patch(`/appointments/${id}/status`, { status: 'CANCELLED' })
      toast.success('Agendamento cancelado')
      fetchAppointments()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao cancelar agendamento')
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Deseja realmente excluir este agendamento? Esta ação não pode ser desfeita.')) return

    try {
      await api.delete(`/appointments/${id}`)
      toast.success('Agendamento excluído com sucesso')
      fetchAppointments()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir agendamento')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-pink-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-soft">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-pink-100 dark:border-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center shadow-elegant mr-3">
                <span className="text-white text-xl font-bold font-display">FG</span>
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                FlowGest
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/agendar" className="gradient-pink text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-elegant transition-all">
                ✨ Novo Agendamento
              </Link>
              <Link href="/perfil" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Perfil
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-8">Meus Agendamentos</h2>

        {appointments.length === 0 ? (
          <div className="card-elegant p-12 text-center">
            <div className="w-24 h-24 gradient-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant">
              <span className="text-5xl">💅</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">Você ainda não tem agendamentos</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Que tal agendar seu primeiro serviço de beleza?</p>
            <Link href="/agendar" className="inline-block gradient-pink text-white px-6 py-3 rounded-xl font-semibold hover:shadow-elegant transition-all">
              ✨ Fazer primeiro agendamento
            </Link>
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
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{appointment.service.name}</h3>
                        <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">✨ {appointment.professional.name}</p>
                      </div>
                    </div>
                    <div className="ml-16 space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        📅 {format(new Date(appointment.startTime), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                        <>
                          <Link
                            href={`/agendamentos/${appointment.id}/reagendar`}
                            className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-500 font-medium px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors border border-pink-200 dark:border-pink-800"
                          >
                            🔄 Reagendar
                          </Link>
                          <button
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-500 font-medium px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors border border-yellow-200 dark:border-yellow-800"
                          >
                            ⏸️ Cancelar
                          </button>
                        </>
                      )}
                      {(appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') && (
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-medium px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
                        >
                          🗑️ Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {appointment.payment && (
                  <div className="mt-4 pt-4 border-t border-pink-100">
                    <p className="text-sm text-gray-600 flex items-center">
                      💳 Pagamento: 
                      <span className={`ml-2 font-semibold ${
                        appointment.payment.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {appointment.payment.status === 'PAID' ? '✅ Pago' : '⏳ Pendente'}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

