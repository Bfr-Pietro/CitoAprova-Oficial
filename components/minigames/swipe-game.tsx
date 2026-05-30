'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react'

interface SwipeGameProps {
  config: MinigameConfig
  items: Array<{ content: string; category: 'left' | 'right' | 'up' | 'down'; categoryLabel: string }>
  categories: {
    left: string
    right: string
    up?: string
    down?: string
  }
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

type Direction = 'left' | 'right' | 'up' | 'down' | null

export function SwipeGame({ config, items, categories, onComplete, onClose }: SwipeGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<Direction>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, rotation: 0 })
  const [isDragging, setIsDragging] = useState(false)
  
  const startPosRef = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const gameEndedRef = useRef(false)

  const currentItem = items[currentItemIndex]
  const availableDirections = ['left', 'right'] as Direction[]
  if (categories.up) availableDirections.push('up')
  if (categories.down) availableDirections.push('down')

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setCurrentItemIndex(0)
    setSwipeDirection(null)
    setFeedback(null)
    setCardPosition({ x: 0, y: 0, rotation: 0 })
    startGame()
  }, [startGame])

  // Manipular início do arraste
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (feedback || !state.isActive) return
    setIsDragging(true)
    startPosRef.current = { x: clientX, y: clientY }
  }, [feedback, state.isActive])

  // Manipular movimento
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || feedback) return

    const deltaX = clientX - startPosRef.current.x
    const deltaY = clientY - startPosRef.current.y
    const rotation = deltaX * 0.1
    
    setCardPosition({ x: deltaX, y: deltaY, rotation })

    // Determinar direção do swipe
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    const threshold = 30

    if (absX > absY && absX > threshold) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    } else if (absY > absX && absY > threshold) {
      setSwipeDirection(deltaY > 0 ? 'down' : 'up')
    } else {
      setSwipeDirection(null)
    }
  }, [isDragging, feedback])

  // Manipular fim do arraste
  const handleDragEnd = useCallback(() => {
    if (!isDragging || feedback) return
    setIsDragging(false)

    const threshold = 80
    const { x, y } = cardPosition

    let finalDirection: Direction = null

    if (Math.abs(x) > Math.abs(y)) {
      if (x > threshold) finalDirection = 'right'
      else if (x < -threshold) finalDirection = 'left'
    } else {
      if (y > threshold && categories.down) finalDirection = 'down'
      else if (y < -threshold && categories.up) finalDirection = 'up'
    }

    if (finalDirection && currentItem) {
      // Verificar se acertou
      const isCorrect = finalDirection === currentItem.category

      // Animar saída do card
      const exitPosition = {
        left: { x: -400, y: 0, rotation: -30 },
        right: { x: 400, y: 0, rotation: 30 },
        up: { x: 0, y: -400, rotation: 0 },
        down: { x: 0, y: 400, rotation: 0 }
      }
      
      setCardPosition(exitPosition[finalDirection])
      setFeedback(isCorrect ? 'correct' : 'wrong')

      if (isCorrect) {
        correctAnswer(20)
      } else {
        wrongAnswer(10)
      }

      setTimeout(() => {
        if (currentItemIndex >= items.length - 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame()
          }
        } else {
          setCurrentItemIndex(prev => prev + 1)
          setCardPosition({ x: 0, y: 0, rotation: 0 })
          setFeedback(null)
          setSwipeDirection(null)
        }
      }, 500)
    } else {
      // Voltar ao centro
      setCardPosition({ x: 0, y: 0, rotation: 0 })
      setSwipeDirection(null)
    }
  }, [isDragging, feedback, cardPosition, categories, currentItem, correctAnswer, wrongAnswer, currentItemIndex, items.length, endGame])

  // Swipe com botões (para acessibilidade)
  const handleButtonSwipe = useCallback((direction: Direction) => {
    if (feedback || !state.isActive || !currentItem || !direction) return

    const isCorrect = direction === currentItem.category

    const exitPosition = {
      left: { x: -400, y: 0, rotation: -30 },
      right: { x: 400, y: 0, rotation: 30 },
      up: { x: 0, y: -400, rotation: 0 },
      down: { x: 0, y: 400, rotation: 0 }
    }

    setCardPosition(exitPosition[direction])
    setFeedback(isCorrect ? 'correct' : 'wrong')

    if (isCorrect) {
      correctAnswer(20)
    } else {
      wrongAnswer(10)
    }

    setTimeout(() => {
      if (currentItemIndex >= items.length - 1) {
        if (!gameEndedRef.current) {
          gameEndedRef.current = true
          endGame()
        }
      } else {
        setCurrentItemIndex(prev => prev + 1)
        setCardPosition({ x: 0, y: 0, rotation: 0 })
        setFeedback(null)
        setSwipeDirection(null)
      }
    }, 500)
  }, [feedback, state.isActive, currentItem, correctAnswer, wrongAnswer, currentItemIndex, items.length, endGame])

  // Eventos de mouse/touch
  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY)
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY)
  const handleMouseUp = () => handleDragEnd()
  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
  const handleTouchEnd = () => handleDragEnd()

  if (!currentItem) return null

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

        {/* Progresso */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Item {currentItemIndex + 1} de {items.length}
          </span>
          <div className="flex gap-1">
            {items.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < currentItemIndex ? "bg-primary" :
                  i === currentItemIndex ? "bg-accent" :
                  "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Indicadores de categoria */}
        <div className="relative h-[380px] flex items-center justify-center">
          {/* Categoria esquerda */}
          <div className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 px-3 py-6 rounded-r-xl transition-all",
            swipeDirection === 'left' ? "bg-primary/30 scale-110" : "bg-muted/50"
          )}>
            <ArrowLeft className="h-6 w-6 mb-2 mx-auto" />
            <span className="text-xs font-medium writing-mode-vertical">{categories.left}</span>
          </div>

          {/* Categoria direita */}
          <div className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 px-3 py-6 rounded-l-xl transition-all",
            swipeDirection === 'right' ? "bg-primary/30 scale-110" : "bg-muted/50"
          )}>
            <ArrowRight className="h-6 w-6 mb-2 mx-auto" />
            <span className="text-xs font-medium writing-mode-vertical">{categories.right}</span>
          </div>

          {/* Categoria cima (se existir) */}
          {categories.up && (
            <div className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-b-xl transition-all",
              swipeDirection === 'up' ? "bg-accent/30 scale-110" : "bg-muted/50"
            )}>
              <ArrowUp className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">{categories.up}</span>
            </div>
          )}

          {/* Categoria baixo (se existir) */}
          {categories.down && (
            <div className={cn(
              "absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-t-xl transition-all",
              swipeDirection === 'down' ? "bg-accent/30 scale-110" : "bg-muted/50"
            )}>
              <span className="text-xs font-medium">{categories.down}</span>
              <ArrowDown className="h-5 w-5 mx-auto mt-1" />
            </div>
          )}

          {/* Card */}
          <div
            ref={cardRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={cn(
              "w-48 h-64 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing",
              "bg-gradient-to-br from-card to-card/80 border-2",
              "flex flex-col items-center justify-center p-6 text-center",
              "select-none touch-none",
              feedback === 'correct' && "border-primary",
              feedback === 'wrong' && "border-destructive",
              !feedback && "border-border"
            )}
            style={{
              transform: `translate(${cardPosition.x}px, ${cardPosition.y}px) rotate(${cardPosition.rotation}deg)`,
              transition: isDragging ? 'none' : 'all 0.3s ease-out'
            }}
          >
            {feedback && (
              <div className={cn(
                "absolute top-4 right-4",
                feedback === 'correct' ? "text-primary" : "text-destructive"
              )}>
                <Check className="h-8 w-8" />
              </div>
            )}
            <span className="text-xl font-bold">{currentItem.content}</span>
          </div>
        </div>

        {/* Botões de swipe para acessibilidade */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            onClick={() => handleButtonSwipe('left')}
            disabled={!!feedback}
            className={cn(
              "p-3 rounded-xl transition-all",
              "bg-secondary hover:bg-secondary/80",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ArrowLeft className="h-5 w-5 mx-auto" />
          </button>
          {categories.up ? (
            <button
              onClick={() => handleButtonSwipe('up')}
              disabled={!!feedback}
              className={cn(
                "p-3 rounded-xl transition-all",
                "bg-secondary hover:bg-secondary/80",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ArrowUp className="h-5 w-5 mx-auto" />
            </button>
          ) : <div />}
          {categories.down ? (
            <button
              onClick={() => handleButtonSwipe('down')}
              disabled={!!feedback}
              className={cn(
                "p-3 rounded-xl transition-all",
                "bg-secondary hover:bg-secondary/80",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ArrowDown className="h-5 w-5 mx-auto" />
            </button>
          ) : <div />}
          <button
            onClick={() => handleButtonSwipe('right')}
            disabled={!!feedback}
            className={cn(
              "p-3 rounded-xl transition-all",
              "bg-secondary hover:bg-secondary/80",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ArrowRight className="h-5 w-5 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  )
}
