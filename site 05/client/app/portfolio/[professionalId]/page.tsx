'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import ThemeToggle from '@/components/ThemeToggle'

interface PortfolioImage {
  id: string
  imageUrl: string
  title?: string
  description?: string
  category?: string
  createdAt: string
}

export default function PortfolioViewPage() {
  const params = useParams()
  const router = useRouter()
  const professionalId = params.professionalId as string
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null)

  useEffect(() => {
    if (professionalId) {
      loadPortfolio()
    }
  }, [professionalId])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/portfolio/professional/${professionalId}`)
      setImages(response.data || [])
    } catch (error: any) {
      console.error('Erro ao carregar portfólio:', error)
      toast.error('Erro ao carregar portfólio')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando portfólio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📸 Galeria de Trabalhos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Conheça nossos trabalhos realizados
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <BackButton />
          </div>
        </div>

        {/* Galeria */}
        {images.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nenhuma imagem no portfólio ainda
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              O profissional ainda não adicionou trabalhos ao portfólio
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative aspect-square">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Trabalho'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Imagem+Indisponível'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4">
                  {image.title && (
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  {image.category && (
                    <span className="inline-block px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded text-xs">
                      {image.category === 'before_after' ? 'Antes e Depois' :
                       image.category === 'work' ? 'Trabalho Realizado' :
                       image.category === 'service' ? 'Serviço' : image.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Imagem Ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title || 'Trabalho'}
                className="w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Imagem+Indisponível'
                }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedImage.title && (
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedImage.title}
                </h3>
              )}
              {selectedImage.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedImage.description}
                </p>
              )}
              {selectedImage.category && (
                <span className="inline-block px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded text-sm">
                  {selectedImage.category === 'before_after' ? 'Antes e Depois' :
                   selectedImage.category === 'work' ? 'Trabalho Realizado' :
                   selectedImage.category === 'service' ? 'Serviço' : selectedImage.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

