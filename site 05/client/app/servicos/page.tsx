'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
}

export default function ServicosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  })

  useEffect(() => {
    if (!user || (user.role !== 'PROFESSIONAL' && user.role !== 'ADMIN')) {
      router.push('/dashboard/cliente')
    } else {
      fetchServices()
    }
  }, [user, router])

  const fetchServices = async () => {
    try {
      const response = await api.get('/services', {
        params: { professionalId: user?.id }
      })
      setServices(response.data)
    } catch (error) {
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData)
        toast.success('Serviço atualizado com sucesso!')
      } else {
        await api.post('/services', formData)
        toast.success('Serviço criado com sucesso!')
      }
      setShowForm(false)
      setEditingService(null)
      setFormData({ name: '', description: '', duration: 30, price: 0 })
      fetchServices()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar serviço')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return
    }

    try {
      await api.delete(`/services/${id}`)
      toast.success('Serviço excluído com sucesso!')
      fetchServices()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir serviço')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({ name: '', description: '', duration: 30, price: 0 })
  }

  const toggleService = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/services/${id}`, { isActive: !isActive })
      toast.success('Serviço atualizado')
      fetchServices()
    } catch (error: any) {
      toast.error('Erro ao atualizar serviço')
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton href="/dashboard/profissional" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Meus Serviços</h1>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/servicos/configurar"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
            >
              ⚙️ Configurar Serviços Padrão
            </Link>
            <button
              onClick={() => {
                if (showForm) {
                  handleCancel()
                } else {
                  setShowForm(true)
                }
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              {showForm ? 'Cancelar' : 'Novo Serviço'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingService ? 'Editar Serviço' : 'Criar Novo Serviço'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                >
                  {editingService ? 'Salvar Alterações' : 'Criar Serviço'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                  <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                    <span>Duração: {service.duration} min</span>
                    <span>Preço: R$ {service.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      title="Editar"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => toggleService(service.id, service.isActive)}
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                      title={service.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {service.isActive ? '⏸️ Desativar' : '▶️ Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                      title="Excluir"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Nenhum serviço cadastrado ainda</p>
          </div>
        )}
      </div>
    </div>
  )
}

