'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Celula animada decorativa para o loading
function LoadingCell({ delay = 0, size = 80, className = '' }: { delay?: number; size?: number; className?: string }) {
  return (
    <div 
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ 
        width: size, 
        height: size,
        animation: `float 4s ease-in-out infinite ${delay}s, fadeInCell 1s ease-out ${delay * 0.3}s both`,
        background: 'radial-gradient(circle at 30% 30%, oklch(0.55 0.20 160 / 0.2) 0%, oklch(0.85 0.08 140 / 0.3) 40%, oklch(0.65 0.15 60 / 0.15) 100%)'
      }}
    >
      {/* Nucleo */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '35%',
          height: '35%',
          top: '25%',
          left: '30%',
          background: 'radial-gradient(circle, oklch(0.55 0.18 280 / 0.5) 0%, transparent 70%)'
        }}
      />
      {/* Mitocondria */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '15%',
          height: '10%',
          top: '60%',
          left: '55%',
          background: 'oklch(0.60 0.20 25 / 0.5)',
          borderRadius: '50%'
        }}
      />
    </div>
  )
}

// DNA Helix animada
function DNAHelix({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <svg width="60" height="120" viewBox="0 0 60 120" className="animate-spin-slow opacity-30">
        <defs>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.55 0.20 160)" />
            <stop offset="100%" stopColor="oklch(0.60 0.18 280)" />
          </linearGradient>
        </defs>
        {[0, 20, 40, 60, 80, 100].map((y, i) => (
          <g key={i}>
            <circle cx={30 + Math.sin(y * 0.1) * 15} cy={y + 10} r="4" fill="url(#dnaGradient)" />
            <circle cx={30 - Math.sin(y * 0.1) * 15} cy={y + 10} r="4" fill="url(#dnaGradient)" />
            <line 
              x1={30 + Math.sin(y * 0.1) * 15} 
              y1={y + 10} 
              x2={30 - Math.sin(y * 0.1) * 15} 
              y2={y + 10} 
              stroke="url(#dnaGradient)" 
              strokeWidth="2"
              opacity="0.5"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simula carregamento progressivo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Aumenta mais rapido no inicio, desacelera no final
        const increment = prev < 60 ? 8 : prev < 85 ? 4 : 2
        return Math.min(prev + increment, 100)
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const completeTimer = setTimeout(() => setIsComplete(true), 300)
      const hideTimer = setTimeout(() => setIsVisible(false), 800)
      return () => {
        clearTimeout(completeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [progress])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Carregando CitoAprova"
    >
      {/* Background com padrao de celulas */}
      <div className="absolute inset-0 bg-cell-pattern" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-cell opacity-30" aria-hidden="true" />
      
      {/* Celulas flutuantes decorativas */}
      <LoadingCell delay={0} size={100} className="top-[15%] left-[10%]" />
      <LoadingCell delay={0.5} size={70} className="top-[20%] right-[15%]" />
      <LoadingCell delay={1} size={90} className="bottom-[25%] left-[8%]" />
      <LoadingCell delay={1.5} size={60} className="bottom-[20%] right-[10%]" />
      <LoadingCell delay={0.8} size={50} className="top-[60%] left-[20%]" />
      <LoadingCell delay={1.2} size={80} className="top-[50%] right-[20%]" />
      
      {/* DNA Helix decorativas */}
      <DNAHelix className="top-[10%] left-[25%]" />
      <DNAHelix className="bottom-[10%] right-[25%]" />
      
      {/* Conteudo central */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo principal */}
        <div 
          className={`relative mb-8 transition-all duration-700 ${
            progress >= 100 ? 'scale-110' : 'scale-100'
          }`}
        >
          <Image
            src="/images/logo.png"
            alt="CitoAprova"
            width={320}
            height={100}
            priority
            className="h-auto w-[280px] md:w-[320px] drop-shadow-lg"
          />
        </div>

        {/* Barra de progresso */}
        <div className="w-64 md:w-80 mb-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 10px var(--glow), 0 0 20px var(--glow)'
              }}
            />
          </div>
        </div>

        {/* Texto de loading */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium">
            {progress < 100 ? 'Preparando as células...' : 'Pronto!'}
          </span>
          {progress < 100 && (
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  style={{
                    animation: `bounce 1s ease-in-out infinite ${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de transicao entre paginas
export function PageTransition({ isTransitioning }: { isTransitioning: boolean }) {
  if (!isTransitioning) return null

  return (
    <div 
      className="fixed inset-0 z-[99] flex items-center justify-center bg-background/95 backdrop-blur-sm"
      style={{
        animation: 'fadeInOut 0.6s ease-in-out forwards'
      }}
      aria-hidden="true"
    >
      <div 
        className="relative"
        style={{
          animation: 'scaleIn 0.4s ease-out forwards'
        }}
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={240}
          height={75}
          className="h-auto w-[200px] md:w-[240px] drop-shadow-md"
        />
      </div>
    </div>
  )
}
