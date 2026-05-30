'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, X } from 'lucide-react'

interface TapItem {
  id: string
  content: string
  isCorrect: boolean
  position: { x: number; y: number }
  isVisible: boolean
  isClicked: boolean
  clickResult?: 'correct' | 'wrong'
}

interface TapGameProps {
  config: MinigameConfig
  items: Array<{ content: string; isCorrect: boolean }>
  avoidMode?: boolean // true = evitar errados, false = clicar nos certos
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function TapGame({ config, items, avoidMode = false, onComplete, onClose }: TapGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [activeItems, setActiveItems] = useState<TapItem[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const clickedItemsRef = useRef<Set<string>>(new Set())

  // Gerar posicao aleatoria
  const getRandomPosition = useCallback(() => {
    return {
      x: 10 + Math.random() * 70, // 10% a 80% da largura
      y: 10 + Math.random() * 60  // 10% a 70% da altura
    }
  }, [])

  // Spawn de itens
  useEffect(() => {
    if (!state.isActive) return

    const spawnItem = () => {
      const randomItem = items[Math.floor(Math.random() * items.length)]
      const newItem: TapItem = {
        id: `${Date.now()}-${Math.random()}`,
        content: randomItem.content,
        isCorrect: randomItem.isCorrect,
        position: getRandomPosition(),
        isVisible: true,
        isClicked: false
      }

      setActiveItems(prev => [...prev.slice(-8), newItem]) // Manter max 9 itens
    }

    // Spawn inicial
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnItem(), i * 300)
    }

    // Spawn continuo
    const spawnRate = Math.max(800, 2000 - config.difficulty * 400)
    spawnIntervalRef.current = setInterval(spawnItem, spawnRate)

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current)
      }
    }
  }, [state.isActive, items, config.difficulty, getRandomPosition])

  // Remover itens antigos
  useEffect(() => {
    if (!state.isActive) return

    const cleanup = setInterval(() => {
      setActiveItems(prev => {
        const now = Date.now()
        return prev.filter(item => {
          const itemAge = now - parseInt(item.id.split('-')[0])
          return itemAge < 3000 || item.isClicked
        })
      })
    }, 500)

    return () => clearInterval(cleanup)
  }, [state.isActive])

  const handleItemClick = useCallback((item: TapItem) => {
    if (!state.isActive || item.isClicked) return
    
    // Verificar se ja foi clicado para evitar duplo processamento
    if (clickedItemsRef.current.has(item.id)) return
    clickedItemsRef.current.add(item.id)

    // isCorrect=true significa item CORRETO (verde) - deve clicar
    // isCorrect=false significa item ERRADO (vermelho) - deve evitar
    const isCorrectAction = item.isCorrect // Clicar em verde = correto, clicar em vermelho = errado

    setActiveItems(prev => prev.map(i =>
      i.id === item.id
        ? { ...i, isClicked: true, clickResult: isCorrectAction ? 'correct' : 'wrong' }
        : i
    ))

    if (isCorrectAction) {
      correctAnswer(15)
    } else {
      wrongAnswer(10)
    }

    // Remover apos animacao
    setTimeout(() => {
      setActiveItems(prev => prev.filter(i => i.id !== item.id))
    }, 500)
  }, [state.isActive, correctAnswer, wrongAnswer])

  // Iniciar jogo
  useEffect(() => {
    // Limpar itens ativos e refs ao iniciar novo jogo
    setActiveItems([])
    clickedItemsRef.current.clear()
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
          {avoidMode ? 'Clique nos itens verdes (corretos) e evite os vermelhos (errados)!' : 'Clique apenas nos itens verdes (relacionados à citologia)!'}
        </p>

        {/* Area de jogo */}
        <div
          ref={containerRef}
          className="relative bg-card/50 rounded-2xl border-2 border-border h-[400px] overflow-hidden"
        >
          {/* Fundo decorativo */}
          <div className="absolute inset-0 bg-grid-cell opacity-50" />

          {activeItems.map(item => {
            // isCorrect=true = deve clicar (verde), isCorrect=false = deve evitar (vermelho)
            const highlightColor = item.isCorrect 
              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
              : "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground shadow-md"
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.isClicked}
                className={cn(
                  "absolute px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200",
                  "transform hover:scale-110 active:scale-95",
                  "animate-bounce-in",
                  item.isClicked
                    ? item.clickResult === 'correct'
                      ? "bg-primary/20 border-2 border-primary scale-110"
                      : "bg-destructive/20 border-2 border-destructive scale-90 animate-shake"
                    : highlightColor
                )}
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`
                }}
              >
                {item.isClicked ? (
                  item.clickResult === 'correct' ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )
                ) : (
                  item.content
                )}
              </button>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">Clique (Correto)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive" />
            <span className="text-muted-foreground">Evite (Errado)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
