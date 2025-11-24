'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
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

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newImage, setNewImage] = useState({
    imageUrl: '',
    title: '',
    description: '',
    category: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && (user.role === 'PROFESSIONAL' || user.role === 'ADMIN')) {
      loadPortfolio()
    } else {
      router.push('/dashboard/cliente')
    }
  }, [user, authLoading])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/portfolio/professional/${user?.id}`)
      setImages(response.data || [])
    } catch (error: any) {
      console.error('Erro ao carregar portfólio:', error)
      toast.error('Erro ao carregar portfólio')
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/portfolio', newImage)
      toast.success('Imagem adicionada com sucesso!')
      setShowAddForm(false)
      setNewImage({ imageUrl: '', title: '', description: '', category: '' })
      loadPortfolio()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar imagem')
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) return

    try {
      await api.delete(`/portfolio/${id}`)
      toast.success('Imagem deletada com sucesso!')
      loadPortfolio()
    } catch (error: any) {
      toast.error('Erro ao deletar imagem')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-100 via-brown-100 to-brown-200 dark:from-gray-900 dark:via-brown-900 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📸 Galeria de Trabalhos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Mostre seus melhores trabalhos
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <BackButton />
          </div>
        </div>

        {/* Botão Adicionar */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-brown-600 hover:bg-brown-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Adicionar Imagem</span>
          </button>
        </div>

        {/* Formulário Adicionar */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Nova Imagem
            </h2>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL da Imagem *
                </label>
                <input
                  type="url"
                  required
                  value={newImage.imageUrl}
                  onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use serviços como Imgur, Cloudinary ou similar
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Ex: Manicure com esmaltação"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  placeholder="Descreva o trabalho realizado..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Selecione...</option>
                  <option value="before_after">Antes e Depois</option>
                  <option value="work">Trabalho Realizado</option>
                  <option value="service">Serviço</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg transition-colors"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewImage({ imageUrl: '', title: '', description: '', category: '' })
                  }}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Galeria */}
        {images.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nenhuma imagem no portfólio ainda
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Adicione imagens dos seus trabalhos para mostrar aos clientes
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
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
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                    title="Deletar"
                  >
                    🗑️
                  </button>
                </div>
                <div className="p-4">
                  {image.title && (
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {image.description}
                    </p>
                  )}
                  {image.category && (
                    <span className="inline-block px-2 py-1 bg-brown-200 dark:bg-brown-900 text-brown-700 dark:text-brown-400 rounded text-xs">
                      {image.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

