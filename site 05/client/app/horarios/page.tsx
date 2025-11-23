'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'

const DAYS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' }
]

interface WorkingHours {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export default function HorariosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '18:00'
  })
  const [bulkEdit, setBulkEdit] = useState(false)
  const [bulkData, setBulkData] = useState({
    startTime: '09:00',
    endTime: '18:00',
    days: [1, 2, 3, 4, 5] // Segunda a Sexta por padrão
  })

  useEffect(() => {
    if (!user || (user.role !== 'PROFESSIONAL' && user.role !== 'ADMIN')) {
      router.push('/dashboard/cliente')
    } else {
      fetchWorkingHours()
    }
  }, [user, router])

  const fetchWorkingHours = async () => {
    try {
      const response = await api.get('/working-hours')
      setWorkingHours(response.data)
    } catch (error) {
      toast.error('Erro ao carregar horários')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (dayOfWeek: number) => {
    try {
      await api.post('/working-hours', {
        dayOfWeek,
        ...formData
      })
      toast.success('Horário salvo com sucesso!')
      setEditingDay(null)
      fetchWorkingHours()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar horário')
    }
  }

  const handleBulkSubmit = async () => {
    try {
      // Salvar horários para todos os dias selecionados
      const promises = bulkData.days.map(dayOfWeek =>
        api.post('/working-hours', {
          dayOfWeek,
          startTime: bulkData.startTime,
          endTime: bulkData.endTime
        })
      )
      
      await Promise.all(promises)
      toast.success(`Horários salvos para ${bulkData.days.length} dia(s)!`)
      setBulkEdit(false)
      fetchWorkingHours()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar horários')
    }
  }

  const handleQuickSetup = (type: 'weekdays' | 'allweek') => {
    if (type === 'weekdays') {
      setBulkData({
        ...bulkData,
        days: [1, 2, 3, 4, 5], // Segunda a Sexta
        startTime: '09:00',
        endTime: '18:00'
      })
    } else {
      setBulkData({
        ...bulkData,
        days: [0, 1, 2, 3, 4, 5, 6], // Domingo a Domingo
        startTime: '09:00',
        endTime: '18:00'
      })
    }
    setBulkEdit(true)
  }

  const toggleDay = (day: number) => {
    if (bulkData.days.includes(day)) {
      setBulkData({
        ...bulkData,
        days: bulkData.days.filter(d => d !== day)
      })
    } else {
      setBulkData({
        ...bulkData,
        days: [...bulkData.days, day]
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <BackButton href="/dashboard/profissional" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Horários de Trabalho</h1>
          </div>
        </div>

        {/* Configuração Rápida */}
        {!bulkEdit && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração Rápida</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => handleQuickSetup('weekdays')}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm font-medium"
              >
                📅 Segunda a Sábado
              </button>
              <button
                onClick={() => handleQuickSetup('allweek')}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm font-medium"
              >
                📅 Domingo a Domingo
              </button>
              <button
                onClick={() => setBulkEdit(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                ⚙️ Configuração Personalizada
              </button>
            </div>
          </div>
        )}

        {/* Formulário de Configuração em Massa */}
        {bulkEdit && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Configuração em Massa</h2>
              <button
                onClick={() => setBulkEdit(false)}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ✕ Fechar
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário de Abertura
                </label>
                <input
                  type="time"
                  value={bulkData.startTime}
                  onChange={(e) => setBulkData({ ...bulkData, startTime: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário de Fechamento
                </label>
                <input
                  type="time"
                  value={bulkData.endTime}
                  onChange={(e) => setBulkData({ ...bulkData, endTime: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mb-3">
                  Selecione os dias da semana
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DAYS.map((day) => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bulkData.days.includes(day.value)}
                        onChange={() => toggleDay(day.value)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkSubmit}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                >
                  Salvar para Dias Selecionados
                </button>
                <button
                  onClick={() => setBulkEdit(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Dias */}
        <div className="bg-white rounded-lg shadow">
          {DAYS.map((day) => {
            const existing = workingHours.find(wh => wh.dayOfWeek === day.value)
            const isEditing = editingDay === day.value

            return (
              <div key={day.value} className="border-b last:border-b-0 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{day.label}</h3>
                    {existing && !isEditing && (
                      <p className="text-sm text-gray-600">
                        {existing.startTime} - {existing.endTime}
                        {!existing.isActive && ' (Desativado)'}
                      </p>
                    )}
                    {isEditing && (
                      <div className="mt-2 flex items-center space-x-2">
                        <input
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          className="px-3 py-1 border border-gray-300 rounded-md"
                        />
                        <span>até</span>
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          className="px-3 py-1 border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() => handleSubmit(day.value)}
                          className="bg-primary-600 text-white px-4 py-1 rounded-md text-sm hover:bg-primary-700"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingDay(null)}
                          className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md text-sm hover:bg-gray-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditingDay(day.value)
                        if (existing) {
                          setFormData({
                            startTime: existing.startTime,
                            endTime: existing.endTime
                          })
                        }
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {existing ? 'Editar' : 'Adicionar'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
