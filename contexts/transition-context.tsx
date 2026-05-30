'use client'

import { createContext, useContext, useState, useCallback, useEffect, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface TransitionContextType {
  isTransitioning: boolean
  startTransition: (callback: () => void) => void
  navigateTo: (path: string) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [, startReactTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  // Monitora mudancas de rota para finalizar a transicao
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 600) // Duracao da animacao de fade out
      return () => clearTimeout(timer)
    }
  }, [pathname, isTransitioning])

  const startTransition = useCallback((callback: () => void) => {
    setIsTransitioning(true)
    // Aguarda o fade-in antes de executar a acao
    setTimeout(() => {
      startReactTransition(() => {
        callback()
      })
    }, 200)
  }, [])

  const navigateTo = useCallback((path: string) => {
    if (path === pathname) return
    
    setIsTransitioning(true)
    // Aguarda o fade-in antes de navegar
    setTimeout(() => {
      startReactTransition(() => {
        router.push(path)
      })
    }, 200)
  }, [pathname, router])

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, navigateTo }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('usePageTransition must be used within a TransitionProvider')
  }
  return context
}
