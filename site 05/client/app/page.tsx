'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'CLIENT') {
          router.push('/dashboard/cliente')
        } else if (user.role === 'PROFESSIONAL' || user.role === 'ADMIN') {
          router.push('/dashboard/profissional')
        }
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-soft">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-pink rounded-xl flex items-center justify-center shadow-elegant mr-3">
                <span className="text-white text-xl font-bold font-display">FG</span>
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FlowGest
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="gradient-pink text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-elegant transition-all">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Seu salão de beleza
            <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              na palma da mão
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            FlowGest é a plataforma perfeita para agendar seus serviços de beleza. 
            Manicure, pedicure, cabelo e muito mais, tudo de forma simples e elegante.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="gradient-pink text-white px-8 py-4 rounded-xl font-semibold hover:shadow-elegant transition-all transform hover:scale-105 text-lg"
            >
              Começar Agora ✨
            </Link>
            <Link 
              href="/login" 
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold border-2 border-pink-200 hover:border-pink-300 transition-all text-lg"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="card-elegant p-8 hover:transform hover:scale-105 transition-all">
            <div className="w-16 h-16 gradient-pink rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
              <span className="text-3xl">💅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Agenda Elegante</h3>
            <p className="text-gray-600 leading-relaxed">
              Agende seus serviços favoritos com apenas alguns cliques. Interface intuitiva e visual encantador.
            </p>
          </div>

          <div className="card-elegant p-8 hover:transform hover:scale-105 transition-all">
            <div className="w-16 h-16 gradient-pink rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lembretes Inteligentes</h3>
            <p className="text-gray-600 leading-relaxed">
              Nunca mais perca um agendamento! Receba lembretes por email e WhatsApp antes do seu horário.
            </p>
          </div>

          <div className="card-elegant p-8 hover:transform hover:scale-105 transition-all">
            <div className="w-16 h-16 gradient-pink rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pagamento Fácil</h3>
            <p className="text-gray-600 leading-relaxed">
              Pague de forma rápida e segura via PIX ou cartão. Tudo integrado e sem complicação.
            </p>
          </div>
        </div>

        {/* Seção de Serviços */}
        <div className="mt-24">
          <h3 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
            Serviços Disponíveis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '💅', name: 'Manicure' },
              { icon: '🦶', name: 'Pedicure' },
              { icon: '✨', name: 'Alongamentos' },
              { icon: '💇‍♀️', name: 'Cabelo' },
              { icon: '💆', name: 'Estética' }
            ].map((service, index) => (
              <div key={index} className="card-soft p-6 text-center hover:transform hover:scale-105 transition-all">
                <div className="text-4xl mb-3">{service.icon}</div>
                <p className="font-medium text-gray-700">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
