'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ConfigurarServicosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [servicesCount, setServicesCount] = useState(0)

  useEffect(() => {
    if (!user || (user.role !== 'PROFESSIONAL' && user.role !== 'ADMIN')) {
      router.push('/dashboard/cliente')
    } else {
      fetchServicesCount()
    }
  }, [user, router])

  const fetchServicesCount = async () => {
    try {
      const response = await api.get('/services', {
        params: { professionalId: user?.id }
      })
      setServicesCount(response.data.length)
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
    }
  }

  const handleSetupDefault = async () => {
    if (!confirm('Isso irá criar todos os serviços padrão do salão de beleza. Deseja continuar?')) {
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/services-setup/setup-default')
      toast.success(`✅ ${response.data.count} serviços criados com sucesso!`)
      setServicesCount(response.data.count)
      router.push('/servicos')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao configurar serviços')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurar Serviços do Salão</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Configure automaticamente todos os serviços padrão para salão de beleza:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>💅 Manicure (8 serviços)</li>
              <li>🦶 Pedicure (4 serviços)</li>
              <li>✨ Alongamentos (6 serviços)</li>
              <li>💇‍♀️ Cabelo (15 serviços)</li>
              <li>💆 Estética / Sobrancelha / Cílios (9 serviços)</li>
            </ul>
            <p className="text-sm text-gray-500">
              Total: <strong>42 serviços</strong> pré-configurados com preços e durações padrão
            </p>
          </div>

          {servicesCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                Você já tem <strong>{servicesCount} serviços</strong> cadastrados.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Ao configurar, os serviços serão adicionados (não substituirão os existentes).
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleSetupDefault}
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Configurando...' : 'Configurar Serviços Padrão'}
            </button>
            <button
              onClick={() => router.push('/servicos')}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 font-medium"
            >
              Cancelar
            </button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O que será criado:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">💅 Manicure</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Manicure (cutícula + esmaltação)</li>
                  <li>• Esmaltação simples</li>
                  <li>• Esmaltação em gel</li>
                  <li>• Francesinha</li>
                  <li>• Blindagem</li>
                  <li>• Banho de gel</li>
                  <li>• Spa das mãos</li>
                  <li>• Reparo de unha</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🦶 Pedicure</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Pedicure (cutícula + esmaltação)</li>
                  <li>• Esmaltação em gel no pé</li>
                  <li>• Spa dos pés</li>
                  <li>• Reparo de unha do pé</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✨ Alongamentos</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Alongamento em fibra de vidro</li>
                  <li>• Alongamento em gel</li>
                  <li>• Alongamento polygel</li>
                  <li>• Manutenção de alongamento</li>
                  <li>• Remoção de alongamento</li>
                  <li>• Reparo de alongamento</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💇‍♀️ Cabelo</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Corte feminino/masculino/infantil</li>
                  <li>• Escova, Babyliss</li>
                  <li>• Progressiva, Botox</li>
                  <li>• Hidratação, Nutrição, Reconstrução</li>
                  <li>• Cronograma capilar</li>
                  <li>• Coloração, Tonalização</li>
                  <li>• Luzes / Mechas</li>
                  <li>• Matização</li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">💆 Estética / Sobrancelha / Cílios</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Design de sobrancelha, Design + henna, Brow lamination</li>
                  <li>• Lash lifting</li>
                  <li>• Extensão de cílios (fio a fio / híbrido / volume russo)</li>
                  <li>• Manutenção e remoção de cílios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

