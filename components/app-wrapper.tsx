'use client'

import { useState, useEffect } from 'react'
import { LoadingScreen, PageTransition } from './loading-screen'
import { usePageTransition } from '@/contexts/transition-context'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showInitialLoading, setShowInitialLoading] = useState(true)
  const { isTransitioning } = usePageTransition()

  useEffect(() => {
    // Esconde o loading inicial apos a animacao completar
    const timer = setTimeout(() => {
      setShowInitialLoading(false)
    }, 2000) // Tempo total do loading (inclui animacao de saida)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showInitialLoading && <LoadingScreen />}
      <PageTransition isTransitioning={isTransitioning} />
      {children}
    </>
  )
}
