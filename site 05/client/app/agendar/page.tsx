'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import BackButton from '@/components/BackButton'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
  professional: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  icon: string
  services: Service[]
}

export default function AgendarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
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
      fetchCategories()
    }
  }, [user, router])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/services-setup/by-category')
      setCategories(response.data)
    } catch (error) {
      toast.error('Erro ao carregar serviços')
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedService || !selectedDate) return

    setLoadingSlots(true)
    try {
      const response = await api.get(
        `/appointments/availability/${selectedService.professional.id}`,
        {
          params: {
            date: selectedDate,
            serviceId: selectedService.id
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
    if (selectedService && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedService, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService || !selectedDate || !selectedSlot) {
      toast.error('Preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      const startTime = new Date(`${selectedDate}T${selectedSlot}`)
      
      await api.post('/appointments', {
        serviceId: selectedService.id,
        professionalId: selectedService.professional.id,
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

  return (
    <div className="min-h-screen gradient-soft py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header elegante */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <BackButton href="/dashboard/cliente" />
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 dark:from-pink-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
              Agendar Serviço
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Escolha a categoria e encontre o serviço perfeito para você
            </p>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="card-elegant p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💅</span>
            </div>
            <p className="text-gray-800 mb-2 font-medium">
              Nenhum serviço disponível ainda.
            </p>
            <p className="text-sm text-gray-600">
              O profissional precisa configurar os serviços primeiro.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Categorias */}
            {!selectedCategory && (
              <div className="card-elegant p-10 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
                  Selecione uma Categoria
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {categories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="group relative card-soft p-8 hover:shadow-elegant transition-all duration-300 text-center overflow-hidden transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-800"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        <div className="w-24 h-24 rounded-3xl gradient-pink flex items-center justify-center text-5xl shadow-elegant group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mx-auto mb-6">
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 mb-4">
                          {category.name}
                        </h3>
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                            {category.services.length} serviços disponíveis
                          </span>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="flex items-center justify-center text-pink-600 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                          <span className="text-sm font-semibold">Ver serviços</span>
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Serviços da Categoria */}
            {selectedCategory && !selectedService && (
              <div className="max-w-6xl mx-auto">
                <div className="card-elegant p-8 md:p-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between mb-10 pb-8 border-b border-pink-100 dark:border-pink-900/30 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl gradient-pink flex items-center justify-center text-3xl shadow-elegant flex-shrink-0">
                        {selectedCategory.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {selectedCategory.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Escolha um serviço abaixo
                        </p>
                      </div>
                    </div>
                    <BackButton
                      onClick={() => {
                        setSelectedCategory(null)
                        setSelectedService(null)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {selectedCategory.services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className="group relative card-soft p-6 md:p-7 hover:shadow-elegant transition-all duration-300 text-left overflow-hidden transform hover:-translate-y-1 border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-800"
                      >
                        {/* Hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 mb-4 line-clamp-2 min-h-[3rem]">
                            {service.name}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{service.duration} minutos</span>
                            </div>
                            <div className="pt-3 border-t border-pink-100 dark:border-pink-900/30">
                              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                                R$ {service.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Formulário de Agendamento */}
            {selectedService && (
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="card-elegant p-8 md:p-10 space-y-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-8 pb-8 border-b border-pink-100 dark:border-pink-900/30 gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{selectedService.name}</h2>
                      {selectedService.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedService.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                          ⏱️ {selectedService.duration} min
                        </span>
                        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                          R$ {selectedService.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <BackButton 
                      label="Trocar serviço"
                      onClick={() => {
                        setSelectedService(null)
                        setSelectedDate('')
                        setSelectedSlot('')
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 Selecione a data
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                        setSelectedSlot('')
                      }}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-4 py-3 border border-pink-200 dark:border-purple-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-pink-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        ⏰ Selecione o horário
                      </label>
                      
                      {loadingSlots ? (
                        <div className="text-center py-8 bg-pink-50/50 dark:bg-gray-800/50 rounded-xl border-2 border-pink-200 dark:border-purple-900/50">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 dark:border-pink-400 mx-auto mb-3"></div>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">Carregando horários disponíveis...</p>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="bg-pink-50/50 dark:bg-gray-800/50 rounded-xl p-4 border-2 border-pink-200 dark:border-purple-900/50">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Escolha um horário disponível abaixo:
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {availableSlots.map((slot, index) => {
                              const time = new Date(slot)
                              const timeString = format(time, 'HH:mm')
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setSelectedSlot(timeString)}
                                  className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                                    selectedSlot === timeString
                                      ? 'gradient-pink text-white border-pink-500 dark:border-pink-400 shadow-elegant scale-105'
                                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-pink-200 dark:border-purple-900/50 hover:border-pink-400 dark:hover:border-pink-500 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                                  }`}
                                >
                                  {timeString}
                                </button>
                              )
                            })}
                          </div>
                          {selectedSlot && (
                            <div className="mt-4 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg border border-pink-200 dark:border-pink-800">
                              <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                                ✓ Horário selecionado: <span className="font-bold">{selectedSlot}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">⚠️</div>
                            <div>
                              <p className="text-yellow-800 dark:text-yellow-300 font-semibold mb-1">
                                Nenhum horário disponível para esta data
                              </p>
                              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                Por favor, selecione outra data ou entre em contato com o profissional para verificar a disponibilidade.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      💬 Observações (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-pink-200 dark:border-purple-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-pink-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100"
                      placeholder="Alguma observação sobre o agendamento?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !selectedSlot}
                    className="w-full gradient-pink text-white py-4 px-4 rounded-xl hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Agendando...
                      </span>
                    ) : (
                      `✨ Confirmar Agendamento - R$ ${selectedService.price.toFixed(2)}`
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
