'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [loading, setLoading] = useState(false)
  const { login, loginPhone } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Limpar dados antigos antes de fazer login
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      
      if (loginMethod === 'email') {
        await login(email.trim(), password)
      } else {
        await loginPhone(phone.trim(), password)
      }
      
      // Aguardar um pouco para garantir que o userRole foi salvo
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirecionar baseado no role do usuário
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'CLIENT') {
        router.push('/dashboard/cliente')
      } else {
        router.push('/dashboard/profissional')
      }
    } catch (error) {
      // Erro já tratado no contexto
      console.error('Erro no login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 gradient-pink rounded-2xl flex items-center justify-center shadow-elegant">
              <span className="text-white text-3xl font-bold font-display">FG</span>
            </div>
          </div>
          <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            FlowGest
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Seu salão de beleza na palma da mão
          </p>
        </div>

        <div className="card-elegant p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Bem-vinda de volta!</h3>
            <p className="text-gray-600 text-sm">Entre para continuar agendando seus serviços</p>
          </div>

          {/* Tabs de Login */}
          <div className="mb-6 flex space-x-2 bg-pink-50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              📧 Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              📱 Telefone
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {loginMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-pink-50/50"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-pink-50/50"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-pink-50/50"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link href="/register" className="font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          ✨ Agendamentos fáceis e elegantes para você
        </p>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
