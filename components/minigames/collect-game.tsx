'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'

interface FallingItem {
  id: string
  content: string
  isCorrect: boolean
  x: number
  y: number
  speed: number
}

interface CollectGameProps {
  config: MinigameConfig
  items: Array<{ content: string; isCorrect: boolean }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function CollectGame({ config, items, onComplete, onClose }: CollectGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [fallingItems, setFallingItems] = useState<FallingItem[]>([])
  const [catcherX, setCatcherX] = useState(50)
  const [caughtEffect, setCaughtEffect] = useState<{ type: 'correct' | 'wrong'; x: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const caughtItemsRef = useRef<Set<string>>(new Set())

  // Spawn de itens
  useEffect(() => {
    if (!state.isActive) return

    const spawnItem = () => {
      const randomItem = items[Math.floor(Math.random() * items.length)]
      const newItem: FallingItem = {
        id: `${Date.now()}-${Math.random()}`,
        content: randomItem.content,
        isCorrect: randomItem.isCorrect,
        x: 5 + Math.random() * 85,
        y: -10,
        speed: 0.5 + Math.random() * 0.5 + config.difficulty * 0.2
      }
      setFallingItems(prev => [...prev, newItem])
    }

    const spawnInterval = setInterval(spawnItem, Math.max(600, 1500 - config.difficulty * 300))

    return () => clearInterval(spawnInterval)
  }, [state.isActive, items, config.difficulty])

  // Animacao de queda
  useEffect(() => {
    if (!state.isActive) return

    const animate = () => {
      setFallingItems(prev => {
        const updated = prev.map(item => ({
          ...item,
          y: item.y + item.speed
        })).filter(item => item.y < 110)

        return updated
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [state.isActive])

  // Verificar colisoes
  useEffect(() => {
    if (!state.isActive) return

    const checkCollisions = () => {
      setFallingItems(prev => {
        const remaining: FallingItem[] = []
        prev.forEach(item => {
          // Area do catcher: y > 80 e x proximo do catcherX
          if (item.y > 80 && item.y < 95 && Math.abs(item.x - catcherX) < 15) {
            // Verificar se o item já foi pego para evitar processamento duplo
            if (caughtItemsRef.current.has(item.id)) {
              return // Já foi processado, ignorar
            }
            caughtItemsRef.current.add(item.id)
            
            // Pegou!
            if (item.isCorrect) {
              correctAnswer(15)
              setCaughtEffect({ type: 'correct', x: item.x })
            } else {
              wrongAnswer(10)
              setCaughtEffect({ type: 'wrong', x: item.x })
            }
            setTimeout(() => setCaughtEffect(null), 500)
          } else {
            remaining.push(item)
          }
        })
        return remaining
      })
    }

    const collisionInterval = setInterval(checkCollisions, 50)
    return () => clearInterval(collisionInterval)
  }, [state.isActive, catcherX, correctAnswer, wrongAnswer])

  // Controles de movimento
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setCatcherX(Math.max(10, Math.min(90, x)))
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX)
  }, [handleMove])

  // Iniciar jogo
  useEffect(() => {
    // Limpar referência de itens pegos ao iniciar novo jogo
    caughtItemsRef.current.clear()
    startGame()
  }, [startGame])

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

        {/* Area de jogo */}
        <div
          ref={containerRef}
          className="relative bg-gradient-to-b from-card/30 to-card/80 rounded-2xl border-2 border-border h-[400px] overflow-hidden cursor-none touch-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Itens caindo */}
          {fallingItems.map(item => (
            <div
              key={item.id}
              className={cn(
                "absolute px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                "transform -translate-x-1/2",
                item.isCorrect
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                  : "bg-gradient-to-br from-destructive/80 to-destructive/60 text-destructive-foreground shadow-md"
              )}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`
              }}
            >
              {item.content}
            </div>
          ))}

          {/* Efeito de captura */}
          {caughtEffect && (
            <div
              className={cn(
                "absolute bottom-16 transform -translate-x-1/2 animate-score-pop",
                "text-lg font-bold",
                caughtEffect.type === 'correct' ? "text-primary" : "text-destructive"
              )}
              style={{ left: `${caughtEffect.x}%` }}
            >
              {caughtEffect.type === 'correct' ? '+15' : '-10'}
            </div>
          )}

          {/* Catcher / Cesto */}
          <div
            className="absolute bottom-4 w-24 h-12 transform -translate-x-1/2 transition-all duration-75"
            style={{ left: `${catcherX}%` }}
          >
            <div className="w-full h-full bg-gradient-to-t from-primary to-primary/60 rounded-t-xl border-2 border-primary shadow-lg relative">
              {/* Decoracao do cesto */}
              <div className="absolute inset-x-2 top-1 h-1 bg-primary-foreground/30 rounded-full" />
              <div className="absolute inset-x-4 top-3 h-0.5 bg-primary-foreground/20 rounded-full" />
            </div>
          </div>

          {/* Linha de base */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-secondary to-transparent" />
        </div>

        {/* Instrucoes */}
        <p className="text-center text-xs text-muted-foreground mt-3">
          Arraste para mover o cesto e coletar os itens corretos!
        </p>
      </div>
    </div>
  )
}
