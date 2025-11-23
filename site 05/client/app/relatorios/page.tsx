'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import BackButton from '@/components/BackButton'

interface Stats {
  appointments: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
  revenue: {
    total: number
  }
}

interface PopularService {
  serviceId: string
  serviceName: string
  count: number
  revenue: number
}

interface RevenueReport {
  totalRevenue: number
  revenueByMethod: {
    [key: string]: number
  }
  totalTransactions: number
  period: {
    startDate: string | null
    endDate: string | null
  }
}

interface RecurringClient {
  clientId: string
  clientName: string
  email: string
  phone?: string
  appointmentCount: number
}

export default function RelatoriosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [popularServices, setPopularServices] = useState<PopularService[]>([])
  const [revenue, setRevenue] = useState<RevenueReport | null>(null)
  const [recurringClients, setRecurringClients] = useState<RecurringClient[]>([])
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && user.role === 'CLIENT') {
      router.push('/dashboard/cliente')
    } else if (user) {
      fetchAllReports()
    }
  }, [user, authLoading, router])

  const fetchAllReports = async () => {
    setLoading(true)
    try {
      const [statsRes, popularRes, revenueRes, clientsRes] = await Promise.all([
        api.get('/reports/stats'),
        api.get('/reports/popular-services'),
        api.get('/reports/revenue'),
        api.get('/reports/recurring-clients')
      ])
      setStats(statsRes.data)
      setPopularServices(popularRes.data)
      setRevenue(revenueRes.data)
      setRecurringClients(clientsRes.data)
    } catch (error) {
      toast.error('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (dateRange.startDate) params.startDate = dateRange.startDate
      if (dateRange.endDate) params.endDate = dateRange.endDate

      const [popularRes, revenueRes, clientsRes] = await Promise.all([
        api.get('/reports/popular-services', { params }),
        api.get('/reports/revenue', { params }),
        api.get('/reports/recurring-clients', { params })
      ])
      setPopularServices(popularRes.data)
      setRevenue(revenueRes.data)
      setRecurringClients(clientsRes.data)
      toast.success('Relatórios atualizados')
    } catch (error) {
      toast.error('Erro ao filtrar relatórios')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BackButton href="/dashboard/profissional" />
              <h1 className="text-xl font-bold text-pink-600 dark:text-pink-400 ml-4">Relatórios</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro de Data */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Período</h2>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleDateFilter}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
              >
                Filtrar
              </button>
            </div>
            {(dateRange.startDate || dateRange.endDate) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setDateRange({ startDate: '', endDate: '' })
                    fetchAllReports()
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Limpar Filtro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas Gerais */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total de Agendamentos</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.appointments.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.appointments.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Confirmados</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.appointments.confirmed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Concluídos</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{stats.appointments.completed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Receita Total</h3>
              <p className="text-2xl font-bold text-primary-600 mt-2">
                R$ {stats.revenue.total.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Serviços Mais Agendados */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Serviços Mais Agendados</h2>
            {popularServices.length > 0 ? (
              <div className="space-y-3">
                {popularServices.map((service, index) => (
                  <div key={service.serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.serviceName}</p>
                        <p className="text-sm text-gray-600">{service.count} agendamento(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">R$ {service.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum serviço agendado ainda</p>
            )}
          </div>

          {/* Receita por Método de Pagamento */}
          {revenue && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Receita por Método de Pagamento</h2>
              <div className="space-y-3">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      R$ {revenue.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {revenue.totalTransactions} transação(ões)
                  </p>
                </div>
                {Object.entries(revenue.revenueByMethod).map(([method, amount]) => (
                  <div key={method} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">
                      {method === 'PIX' ? '💳 PIX' :
                       method === 'CREDIT_CARD' ? '💳 Cartão de Crédito' :
                       method === 'DEBIT_CARD' ? '💳 Cartão de Débito' :
                       method === 'CASH' ? '💵 Dinheiro' : method}
                    </span>
                    <span className="font-semibold text-gray-900">R$ {amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clientes Recorrentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clientes Recorrentes</h2>
          {recurringClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agendamentos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recurringClients.map((client) => (
                    <tr key={client.clientId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.clientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-primary-600">
                          {client.appointmentCount} vez(es)
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum cliente recorrente ainda</p>
          )}
        </div>
      </main>
    </div>
  )
}

