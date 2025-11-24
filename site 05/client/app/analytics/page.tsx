'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import ThemeToggle from '@/components/ThemeToggle'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AnalyticsData {
  revenue: {
    total: number
    byPeriod: Record<string, number>
    average: number
    forecast: number
  }
  appointments: {
    total: number
    byPeriod: Record<string, number>
    cancelled: number
    cancellationRate: number
  }
  clients: {
    new: number
    recurring: number
    total: number
  }
  popularHours: Array<{
    hour: number
    hourFormatted: string
    count: number
  }>
  period: {
    start: string
    end: string
    type: string
  }
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && (user.role === 'PROFESSIONAL' || user.role === 'ADMIN')) {
      loadAnalytics()
    } else {
      router.push('/dashboard/cliente')
    }
  }, [user, authLoading, period, startDate, endDate])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('period', period)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await api.get(`/reports/analytics?${params.toString()}`)
      setAnalytics(response.data)
    } catch (error: any) {
      console.error('Erro ao carregar analytics:', error)
      toast.error('Erro ao carregar analytics')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brown-100 via-brown-100 to-brown-200 dark:from-gray-900 dark:via-brown-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brown-100 via-brown-100 to-brown-200 dark:from-gray-900 dark:via-brown-900 dark:to-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    )
  }

  const revenueEntries = Object.entries(analytics.revenue.byPeriod).sort()
  const appointmentsEntries = Object.entries(analytics.appointments.byPeriod).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-100 via-brown-100 to-brown-200 dark:from-gray-900 dark:via-brown-900 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📊 Analytics Avançado
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Análise detalhada do seu negócio
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <BackButton />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="day">Por Dia</option>
                <option value="week">Por Semana</option>
                <option value="month">Por Mês</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadAnalytics}
                className="w-full px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg transition-colors"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  R$ {analytics.revenue.total.toFixed(2)}
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics.appointments.total}
                </p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Cancelamento</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {analytics.appointments.cancellationRate.toFixed(1)}%
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Previsão Receita</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  R$ {analytics.revenue.forecast.toFixed(2)}
                </p>
              </div>
              <div className="text-3xl">🔮</div>
            </div>
          </div>
        </div>

        {/* Gráfico de Receita */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Receita ao Longo do Tempo
          </h2>
          <div className="space-y-2">
            {revenueEntries.map(([period, value]) => (
              <div key={period} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">
                  {period}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                    <div
                      className="bg-brown-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(value / analytics.revenue.total) * 100}%`,
                        minWidth: '40px'
                      }}
                    >
                      <span className="text-xs text-white font-medium">
                        R$ {value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Novos</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {analytics.clients.new}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Recorrentes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {analytics.clients.recurring}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Clientes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {analytics.clients.total}
            </p>
          </div>
        </div>

        {/* Horários Mais Procurados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Horários Mais Procurados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.popularHours.slice(0, 10).map((hour) => (
              <div
                key={hour.hour}
                className="bg-brown-100 dark:bg-gray-700 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">{hour.hourFormatted}</p>
                <p className="text-2xl font-bold text-brown-700 dark:text-brown-500 mt-2">
                  {hour.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

