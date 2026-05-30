'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Zap, Flame } from 'lucide-react'

interface ClickEffect {
  id: string
  x: number
  y: number
}

interface ClickerGameProps {
  config: MinigameConfig
  theme: 'energy' | 'mitochondria' | 'atp'
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function ClickerGame({ config, theme, onComplete, onClose }: ClickerGameProps) {
  const { state, startGame, addScore, endGame } = useMinigame({
    config,
    onComplete
  })

  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [clickPower, setClickPower] = useState(1)
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Power-ups baseados no combo
  useEffect(() => {
    if (state.combo >= 30) {
      setClickPower(4)
    } else if (state.combo >= 20) {
      setClickPower(3)
    } else if (state.combo >= 10) {
      setClickPower(2)
    } else {
      setClickPower(1)
    }
  }, [state.combo])

  // Prevenir cliques duplos/fantasmas
  const lastClickRef = useRef<number>(0)
  const minClickInterval = 50 // ms entre cliques
  const lastTouchRef = useRef<boolean>(false)

  const processClick = useCallback((clientX: number, clientY: number) => {
    if (!state.isActive) return

    // Prevenir duplo processamento
    const now = Date.now()
    if (now - lastClickRef.current < minClickInterval) return
    lastClickRef.current = now

    // Adicionar efeito visual
    const effect: ClickEffect = {
      id: `${Date.now()}-${Math.random()}`,
      x: clientX,
      y: clientY
    }
    setClickEffects(prev => [...prev.slice(-10), effect])

    // Remover efeito apos animacao
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== effect.id))
    }, 500)

    // Adicionar pontos
    addScore(clickPower, true)
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 100)
  }, [state.isActive, addScore, clickPower])

  const handleMouseClick = useCallback((e: React.MouseEvent) => {
    // Ignorar se o ultimo evento foi touch (evita duplo processamento)
    if (lastTouchRef.current) {
      lastTouchRef.current = false
      return
    }
    processClick(e.clientX, e.clientY)
  }, [processClick])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    lastTouchRef.current = true
    if (e.changedTouches.length > 0) {
      processClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    }
  }, [processClick])

  // Iniciar jogo
  useEffect(() => {
    startGame()
  }, [startGame])

  const themeConfig = {
    energy: {
      icon: Zap,
      title: 'Energia',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-500/10 to-orange-500/10'
    },
    mitochondria: {
      icon: Flame,
      title: 'ATP',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10'
    },
    atp: {
      icon: Zap,
      title: 'ATP',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10'
    }
  }

  const currentTheme = themeConfig[theme]
  const ThemeIcon = currentTheme.icon

  return (
    <div className="min-h-screen bg-background bg-cell-pattern p-4">
      <div className="max-w-lg mx-auto">
        <GameHeader
          title={config.title}
          score={state.score}
          targetScore={config.targetScore}
          timeRemaining={state.timeRemaining}
          timeLimit={config.timeLimit}
          combo={state.combo}
          onClose={onClose}
        />

        <p className="text-center text-muted-foreground mb-4 text-sm">
          {config.description}
        </p>

        {/* Power indicator */}
        <div className="flex justify-center mb-6">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-gradient-to-r",
            currentTheme.bgColor,
            "border border-primary/20"
          )}>
            <ThemeIcon className="h-5 w-5 text-chart-3" />
            <span className="font-bold">
              +{clickPower} por clique
            </span>
            {clickPower > 1 && (
              <span className="text-xs bg-chart-4 text-white px-2 py-0.5 rounded-full">
                {clickPower}x BONUS
              </span>
            )}
          </div>
        </div>

        {/* Area de clique */}
        <div className="flex flex-col items-center justify-center">
          <button
            ref={buttonRef}
            onClick={handleMouseClick}
            onTouchEnd={handleTouchEnd}
            className={cn(
              "relative w-48 h-48 rounded-full transition-transform duration-100",
              "bg-gradient-to-br shadow-2xl",
              currentTheme.color,
              "hover:shadow-3xl",
              isPressed ? "scale-95" : "scale-100 hover:scale-105",
              "focus:outline-none focus:ring-4 focus:ring-primary/30"
            )}
          >
            {/* Glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-full animate-pulse-glow opacity-50",
              "bg-gradient-to-br",
              currentTheme.color
            )} />
            
            {/* Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
              <ThemeIcon className={cn(
                "w-20 h-20 transition-transform",
                isPressed && "scale-110"
              )} />
              <span className="text-lg font-bold mt-2">CLIQUE!</span>
            </div>

            {/* Ripple rings */}
            {isPressed && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.1s' }} />
              </>
            )}
          </button>

          {/* Click power display */}
          <div className="mt-8 text-center">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {state.score}
            </div>
            <p className="text-muted-foreground mt-1">
              {currentTheme.title} gerada
            </p>
          </div>

          {/* Combo indicator */}
          {state.combo >= 5 && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-chart-4/20 border border-chart-4/30 animate-bounce-in">
              <Flame className="h-5 w-5 text-chart-4" />
              <span className="font-bold text-chart-4">{state.combo} COMBO!</span>
            </div>
          )}
        </div>

        {/* Click effects */}
        {clickEffects.map(effect => (
          <div
            key={effect.id}
            className="fixed pointer-events-none z-50 animate-score-pop"
            style={{ left: effect.x, top: effect.y }}
          >
            <span className="text-lg font-bold text-primary">+{clickPower}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
