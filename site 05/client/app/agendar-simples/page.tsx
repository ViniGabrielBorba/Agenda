'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Configuração do serviço único
const SERVICO_CONFIG = {
  nome: 'Corte de Cabelo', // Altere aqui o nome do serviço
  duracao: 30, // minutos
  preco: 50.00 // R$
}

export default function AgendarSimplesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [professional, setProfessional] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchProfessional()
    }
  }, [user, router])

  const fetchProfessional = async () => {
    try {
      // Buscar o primeiro profissional disponível
      const response = await api.get('/users/professionals')
      if (response.data && response.data.length > 0) {
        setProfessional(response.data[0])
        // Verificar se tem serviço, se não, criar automaticamente
        if (!response.data[0].services || response.data[0].services.length === 0) {
          await createDefaultService(response.data[0].id)
        }
      } else {
        toast.error('Nenhum profissional disponível. Peça ao profissional para criar uma conta.')
      }
    } catch (error) {
      toast.error('Erro ao carregar informações')
    }
  }

  const createDefaultService = async (professionalId: string) => {
    try {
      // Criar serviço padrão se não existir
      await api.post('/services', {
        name: SERVICO_CONFIG.nome,
        duration: SERVICO_CONFIG.duracao,
        price: SERVICO_CONFIG.preco,
        description: 'Agendamento padrão'
      })
      // Recarregar profissional
      fetchProfessional()
    } catch (error) {
      console.error('Erro ao criar serviço padrão:', error)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!professional || !selectedDate) return

    setLoadingSlots(true)
    try {
      // Buscar serviço do profissional
      const services = professional.services || []
      if (services.length === 0) {
        toast.error('Nenhum serviço disponível')
        return
      }

      const service = services[0] // Primeiro serviço

      const response = await api.get(
        `/appointments/availability/${professional.id}`,
        {
          params: {
            date: selectedDate,
            serviceId: service.id
          }
        }
      )
      setAvailableSlots(response.data.availableSlots)
    } catch (error) {
      toast.error('Erro ao carregar horários disponíveis')
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    if (professional && selectedDate) {
      fetchAvailableSlots()
    }
  }, [professional, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!professional || !selectedDate || !selectedSlot) {
      toast.error('Preencha todos os campos')
      return
    }

    const services = professional.services || []
    if (services.length === 0) {
      toast.error('Serviço não disponível')
      return
    }

    const service = services[0]

    setLoading(true)

    try {
      const startTime = new Date(`${selectedDate}T${selectedSlot}`)
      
      await api.post('/appointments', {
        serviceId: service.id,
        professionalId: professional.id,
        startTime: startTime.toISOString(),
        notes
      })

      toast.success('Agendamento criado com sucesso!')
      router.push('/dashboard/cliente')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar agendamento')
    } finally {
      setLoading(false)
    }
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const service = professional.services?.[0]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendar {SERVICO_CONFIG.nome}</h1>
        <p className="text-gray-600 mb-8">Profissional: {professional.name}</p>

        {service && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">Duração: {service.duration} minutos</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">R$ {service.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione a data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setSelectedSlot('')
              }}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {selectedDate && (
            <>
              {loadingSlots ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando horários...</p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o horário
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot, index) => {
                      const time = new Date(slot)
                      const timeString = format(time, 'HH:mm')
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedSlot(timeString)}
                          className={`px-4 py-2 rounded-md border transition-colors ${
                            selectedSlot === timeString
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {timeString}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-yellow-800">Nenhum horário disponível para esta data</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    O profissional pode não ter horários configurados para este dia.
                  </p>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Alguma observação sobre o agendamento?"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 font-medium text-lg"
          >
            {loading ? 'Agendando...' : `Confirmar Agendamento - R$ ${service?.price.toFixed(2) || '0.00'}`}
          </button>
        </form>
      </div>
    </div>
  )
}

