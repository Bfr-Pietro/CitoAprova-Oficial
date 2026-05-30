import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { TransitionProvider } from '@/contexts/transition-context'
import { AppWrapper } from '@/components/app-wrapper'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap'
});

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Detetive Biologico | CitoAprova',
  description: 'Jogo educacional interativo para aprender Citologia para o ENEM. Resolva casos cientificos e restaure o conhecimento do Dr. Cell!',
  generator: 'CitoAprova',
  keywords: ['citologia', 'biologia', 'ENEM', 'jogo educacional', 'celulas', 'teoria celular'],
  authors: [{ name: 'CitoAprova' }],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
        sizes: '32x32',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
        sizes: '32x32',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
          <TransitionProvider>
            <AppWrapper>
              {children}
            </AppWrapper>
          </TransitionProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
