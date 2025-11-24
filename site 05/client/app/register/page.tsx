'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' as 'CLIENT' | 'PROFESSIONAL' | 'ADMIN'
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role
      })

      if (formData.role === 'CLIENT') {
        router.push('/dashboard/cliente')
      } else {
        router.push('/dashboard/profissional')
      }
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brown-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brown-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 gradient-pink rounded-2xl flex items-center justify-center shadow-elegant">
              <span className="text-white text-3xl font-bold font-display">FG</span>
            </div>
          </div>
          <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-brown-700 to-brown-800 bg-clip-text text-transparent">
            FlowGest
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crie sua conta e comece a agendar
          </p>
        </div>

        <div className="card-elegant p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Crie sua conta</h3>
            <p className="text-gray-600 text-sm">Preencha os dados abaixo para começar</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-brown-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent transition-all bg-brown-100/50"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-brown-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent transition-all bg-brown-100/50"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-brown-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent transition-all bg-brown-100/50"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de conta
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-3 border border-brown-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent transition-all bg-brown-100/50"
              >
                <option value="CLIENT">👤 Cliente</option>
                <option value="PROFESSIONAL">💼 Profissional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-brown-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent transition-all bg-brown-100/50"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-brown-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent transition-all bg-brown-100/50"
                placeholder="Digite a senha novamente"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-pink text-white py-3 px-4 rounded-xl font-semibold hover:shadow-elegant transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </span>
              ) : (
                'Criar Conta ✨'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-brown-700 hover:text-brown-700 transition-colors">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
