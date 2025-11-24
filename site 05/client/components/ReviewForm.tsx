'use client'

import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  appointmentId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ReviewForm({ appointmentId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação')
      return
    }

    try {
      setSubmitting(true)
      await api.post('/reviews', {
        appointmentId,
        rating,
        comment: comment.trim() || undefined
      })
      toast.success('Avaliação enviada com sucesso!')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar avaliação')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Avaliar Serviço
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avaliação *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-transform hover:scale-110 ${
                  star <= rating
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {rating === 1 && 'Péssimo'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte-nos sobre sua experiência..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 caracteres
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {submitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

