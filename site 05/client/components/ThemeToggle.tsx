'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-pink-100 dark:bg-purple-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Alternar tema"
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-200 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-purple-600" />
        ) : (
          <Sun className="w-4 h-4 text-pink-600" />
        )}
      </div>
    </button>
  )
}

