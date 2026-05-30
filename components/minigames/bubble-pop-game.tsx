'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'

interface Bubble {
  id: string
  content: string
  isCorrect: boolean
  x: number       // posição atual (calculada a partir de xBase + oscilação)
  xBase: number   // posição horizontal central fixa
  y: number
  phase: number   // fase acumulada para oscilação
  size: number
  speed: number
  oscillationSeed: number
  oscillationSpeed: number  // velocidade da oscilação (varia por bolha)
  oscillationAmp: number    // amplitude da oscilação em % (varia por bolha)
  isPopped: boolean
  popResult?: 'correct' | 'wrong'
}

interface BubblePopGameProps {
  config: MinigameConfig
  items: Array<{ content: string; isCorrect: boolean }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function BubblePopGame({ config, items, onComplete, onClose }: BubblePopGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer } = useMinigame({
    config,
    onComplete
  })

  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const poppedBubblesRef = useRef<Set<string>>(new Set())
  // Física das bolhas em ref — sem passar pelo ciclo de render do React
  const bubblesPhysicsRef = useRef<Bubble[]>([])
  // Refs dos elementos DOM de cada bolha para mover diretamente
  const bubbleElemsRef = useRef<Map<string, HTMLButtonElement>>(new Map())

  const createBubble = useCallback((): Bubble => {
    const randomItem = items[Math.floor(Math.random() * items.length)]
    const size = 60 + Math.random() * 40
    const xBase = 10 + Math.random() * 70
    return {
      id: `${Date.now()}-${Math.random()}`,
      content: randomItem.content,
      isCorrect: randomItem.isCorrect,
      xBase,
      x: xBase,
      y: 95,
      phase: Math.random() * Math.PI * 2,
      size,
      speed: 0.08 + Math.random() * 0.07 + config.difficulty * 0.03,
      oscillationSeed: Math.random() * 100,
      oscillationSpeed: 0.025 + Math.random() * 0.02,
      oscillationAmp: 1.5 + Math.random() * 2,
      isPopped: false
    }
  }, [items, config.difficulty])

  // Spawn de bolhas
  useEffect(() => {
    if (!state.isActive) return

    const spawnBubble = () => {
      const bubble = createBubble()
      bubblesPhysicsRef.current = [...bubblesPhysicsRef.current.slice(-12), bubble]
      setBubbles([...bubblesPhysicsRef.current])
    }

    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnBubble(), i * 500)
    }

    const spawnInterval = setInterval(spawnBubble, Math.max(800, 2000 - config.difficulty * 400))
    return () => clearInterval(spawnInterval)
  }, [state.isActive, createBubble, config.difficulty])

  // Loop de animação — física no ref, posição aplicada direto no DOM
  useEffect(() => {
    if (!state.isActive) return

    let lastTime = performance.now()

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 3) // normaliza para 60fps, cap em 3x
      lastTime = now

      let needsRerender = false

      bubblesPhysicsRef.current = bubblesPhysicsRef.current
        .map(bubble => {
          if (bubble.isPopped) return bubble
          const newPhase = bubble.phase + bubble.oscillationSpeed * delta
          const newY = bubble.y - bubble.speed * delta
          const newX = bubble.xBase + Math.sin(newPhase) * bubble.oscillationAmp

          // Aplica posição direto no DOM — zero re-render
          const el = bubbleElemsRef.current.get(bubble.id)
          if (el) {
            el.style.left = `${newX}%`
            el.style.top = `${newY}%`
          }

          return { ...bubble, x: newX, y: newY, phase: newPhase }
        })
        .filter(bubble => {
          if (bubble.y < -20 && !bubble.isPopped) {
            // Bolha escapou — remove do DOM via re-render
            bubbleElemsRef.current.delete(bubble.id)
            needsRerender = true
            return false
          }
          return true
        })

      if (needsRerender) {
        setBubbles([...bubblesPhysicsRef.current])
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [state.isActive])

  const handleBubblePop = useCallback((bubble: Bubble) => {
    if (!state.isActive || bubble.isPopped) return
    if (poppedBubblesRef.current.has(bubble.id)) return
    poppedBubblesRef.current.add(bubble.id)

    const isCorrectPop = bubble.isCorrect

    // Marca como popped no ref de física
    bubblesPhysicsRef.current = bubblesPhysicsRef.current.map(b =>
      b.id === bubble.id ? { ...b, isPopped: true, popResult: isCorrectPop ? 'correct' : 'wrong' } : b
    )
    setBubbles([...bubblesPhysicsRef.current])

    if (isCorrectPop) {
      correctAnswer(15)
    } else {
      wrongAnswer(10)
    }

    setTimeout(() => {
      bubblesPhysicsRef.current = bubblesPhysicsRef.current.filter(b => b.id !== bubble.id)
      bubbleElemsRef.current.delete(bubble.id)
      setBubbles([...bubblesPhysicsRef.current])
    }, 400)
  }, [state.isActive, correctAnswer, wrongAnswer])

  // Iniciar jogo
  useEffect(() => {
    bubblesPhysicsRef.current = []
    bubbleElemsRef.current = new Map()
    poppedBubblesRef.current = new Set()
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

        {/* Área de jogo */}
        <div
          ref={containerRef}
          className="relative bg-gradient-to-b from-sky-100/20 to-sky-200/30 dark:from-sky-900/20 dark:to-sky-800/30 rounded-2xl border-2 border-sky-300/30 h-[450px] overflow-hidden"
        >
          {/* Efeito de água no fundo */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-400/10 to-transparent" />
          
          {/* Bolhas */}
          {bubbles.map(bubble => (
            <button
              key={bubble.id}
              ref={el => {
                if (el) bubbleElemsRef.current.set(bubble.id, el)
                else bubbleElemsRef.current.delete(bubble.id)
              }}
              onClick={() => handleBubblePop(bubble)}
              disabled={bubble.isPopped}
              className={cn(
                "absolute rounded-full transition-all duration-200",
                "flex items-center justify-center text-center p-2",
                "transform -translate-x-1/2",
                bubble.isPopped
                  ? bubble.popResult === 'correct'
                    ? "scale-150 opacity-0 bg-primary/50"
                    : "scale-50 opacity-0 bg-destructive/50"
                  : bubble.isCorrect
                    ? cn(
                        "bg-gradient-to-br from-primary/80 to-accent/80",
                        "text-primary-foreground shadow-lg",
                        "hover:scale-110 active:scale-95 cursor-pointer",
                        "border-2 border-white/30"
                      )
                    : cn(
                        "bg-gradient-to-br from-destructive/70 to-red-600/70",
                        "text-destructive-foreground shadow-md",
                        "hover:scale-110 active:scale-95 cursor-pointer",
                        "border-2 border-white/20"
                      )
              )}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                fontSize: `${Math.max(10, bubble.size / 6)}px`
              }}
            >
              {!bubble.isPopped && (
                <>
                  {/* Brilho da bolha */}
                  <div className="absolute top-1 left-2 w-3 h-3 bg-white/40 rounded-full" />
                  <span className="font-medium leading-tight break-words z-10">
                    {bubble.content}
                  </span>
                </>
              )}
            </button>
          ))}

          {/* Indicador de zona de escape */}
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-destructive/20 to-transparent flex items-center justify-center">
            <span className="text-xs text-destructive/60 font-medium">Zona de escape</span>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent" />
            <span className="text-muted-foreground">Estoure!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-destructive/70 to-red-600/70" />
            <span className="text-muted-foreground">Evite!</span>
          </div>
        </div>

        {/* Instruções */}
        <p className="text-center text-xs text-muted-foreground mt-3">
          Estoure as bolhas verdes (corretas) antes que escapem!
        </p>
      </div>
    </div>
  )
}