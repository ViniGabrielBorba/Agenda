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

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  client: {
    id: string
    name: string
    avatar?: string
  }
  appointment: {
    service: {
      name: string
    }
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
}

export default function AvaliacoesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && (user.role === 'PROFESSIONAL' || user.role === 'ADMIN')) {
      loadReviews()
    } else {
      router.push('/dashboard/cliente')
    }
  }, [user, authLoading])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/reviews/professional/${user?.id}`)
      setReviews(response.data.reviews || [])
      setStats(response.data.stats || { averageRating: 0, totalReviews: 0 })
    } catch (error: any) {
      console.error('Erro ao carregar avaliações:', error)
      toast.error('Erro ao carregar avaliações')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${
          i < rating
            ? 'text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      >
        ⭐
      </span>
    ))
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-100 via-brown-100 to-brown-200 dark:from-gray-900 dark:via-brown-900 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ⭐ Avaliações
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Veja o que seus clientes estão dizendo
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <BackButton />
          </div>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Avaliação Média
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="flex justify-center">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Total de Avaliações
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stats.totalReviews}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Avaliações */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Ainda não há avaliações
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                As avaliações aparecerão aqui quando seus clientes avaliarem os serviços
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brown-600 flex items-center justify-center text-white font-bold text-lg">
                      {review.client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.client.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(review.createdAt), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    {review.comment}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Serviço: {review.appointment.service.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

