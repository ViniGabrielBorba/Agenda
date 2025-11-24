'use client'

import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import CustomToaster from '@/components/CustomToaster'

const cormorant = Cormorant_Garamond({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>FlowGest - Agendamento Online</title>
        <meta name="description" content="Agende seus serviços de beleza de forma fácil e rápida" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cormorant.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <CustomToaster />
          </AuthProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister().catch(function(err) {
                        console.log('Service worker unregistration failed:', err);
                      });
                    }
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

