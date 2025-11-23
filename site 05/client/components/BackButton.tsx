'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string
  label?: string
  onClick?: () => void
}

export default function BackButton({ href, label = 'Voltar', onClick }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200/50 dark:border-pink-800/30 hover:border-pink-300 dark:hover:border-pink-700 shadow-sm hover:shadow-md transition-all duration-300 font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md">
          <ArrowLeft className="w-5 h-5 text-pink-600 dark:text-pink-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </div>
        <span className="font-semibold">{label}</span>
      </div>
    </button>
  )
}

