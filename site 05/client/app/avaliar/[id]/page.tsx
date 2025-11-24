'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import ThemeToggle from '@/components/ThemeToggle'
import ReviewForm from '@/components/ReviewForm'

interface Appointment {
  id: string
  startTime: string
  service: {
    name: string
    price: number
  }
  professional: {
    name: string
  }
  review?: {
    id: string
    rating: number
    comment?: string
  }
}

export default function AvaliarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role === 'CLIENT') {
      loadAppointment()
    } else {
      router.push('/dashboard/cliente')
    }
  }, [user, authLoading, appointmentId])

  const loadAppointment = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/appointments/${appointmentId}`)
      setAppointment(response.data.appointment)
      
      // Verificar se já existe avaliação
      if (response.data.appointment.review) {
        toast.info('Você já avaliou este agendamento')
        router.push('/dashboard/cliente')
      }
    } catch (error: any) {
      console.error('Erro ao carregar agendamento:', error)
      toast.error('Erro ao carregar agendamento')
      router.push('/dashboard/cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSuccess = () => {
    router.push('/dashboard/cliente')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⭐ Avaliar Serviço
          </h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <BackButton />
          </div>
        </div>

        {/* Informações do Agendamento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Detalhes do Agendamento
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Serviço:</span> {appointment.service.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Profissional:</span> {appointment.professional.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Valor:</span> R$ {appointment.service.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Formulário de Avaliação */}
        <ReviewForm
          appointmentId={appointmentId}
          onSuccess={handleReviewSuccess}
          onCancel={() => router.push('/dashboard/cliente')}
        />
      </div>
    </div>
  )
}

