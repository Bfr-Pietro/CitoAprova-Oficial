'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Link2, Check, X, RefreshCw } from 'lucide-react'

interface MatchItem {
  id: string
  content: string
  type: 'left' | 'right'
  matchId: string
  isMatched: boolean
}

interface PathConnectGameProps {
  config: MinigameConfig
  pairs: Array<{ id: string; left: string; right: string }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function PathConnectGame({ config, pairs, onComplete, onClose }: PathConnectGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [leftItems, setLeftItems] = useState<MatchItem[]>([])
  const [rightItems, setRightItems] = useState<MatchItem[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [connections, setConnections] = useState<Array<{ leftId: string; rightId: string; isCorrect: boolean }>>([])
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; leftId: string; rightId: string } | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const gameEndedRef = useRef(false)

  // Inicializar itens
  useEffect(() => {
    gameEndedRef.current = false
    
    const left = pairs.map(pair => ({
      id: `left-${pair.id}`,
      content: pair.left,
      type: 'left' as const,
      matchId: pair.id,
      isMatched: false
    })).sort(() => Math.random() - 0.5)

    const right = pairs.map(pair => ({
      id: `right-${pair.id}`,
      content: pair.right,
      type: 'right' as const,
      matchId: pair.id,
      isMatched: false
    })).sort(() => Math.random() - 0.5)

    setLeftItems(left)
    setRightItems(right)
    setConnections([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setFeedback(null)
    startGame()
  }, [pairs, startGame])

  // Verificar se todas as conexões foram feitas
  useEffect(() => {
    if (leftItems.length > 0 && leftItems.every(item => item.isMatched) && !gameEndedRef.current) {
      gameEndedRef.current = true
      setTimeout(() => endGame(true), 500)
    }
  }, [leftItems, endGame])

  // Manipular seleção
  const handleSelect = useCallback((item: MatchItem) => {
    if (!state.isActive || item.isMatched || feedback) return

    if (item.type === 'left') {
      setSelectedLeft(prev => prev === item.id ? null : item.id)
      
      // Se já temos um item direito selecionado, verificar match
      if (selectedRight) {
        const rightItem = rightItems.find(r => r.id === selectedRight)
        if (rightItem) {
          checkMatch(item, rightItem)
        }
      }
    } else {
      setSelectedRight(prev => prev === item.id ? null : item.id)
      
      // Se já temos um item esquerdo selecionado, verificar match
      if (selectedLeft) {
        const leftItem = leftItems.find(l => l.id === selectedLeft)
        if (leftItem) {
          checkMatch(leftItem, item)
        }
      }
    }
  }, [state.isActive, feedback, selectedLeft, selectedRight, leftItems, rightItems])

  const checkMatch = useCallback((leftItem: MatchItem, rightItem: MatchItem) => {
    const isCorrect = leftItem.matchId === rightItem.matchId

    setFeedback({ type: isCorrect ? 'correct' : 'wrong', leftId: leftItem.id, rightId: rightItem.id })

    if (isCorrect) {
      correctAnswer(25)
      setConnections(prev => [...prev, { leftId: leftItem.id, rightId: rightItem.id, isCorrect: true }])
      setLeftItems(prev => prev.map(i => i.id === leftItem.id ? { ...i, isMatched: true } : i))
      setRightItems(prev => prev.map(i => i.id === rightItem.id ? { ...i, isMatched: true } : i))
    } else {
      wrongAnswer(10)
    }

    setTimeout(() => {
      setFeedback(null)
      setSelectedLeft(null)
      setSelectedRight(null)
    }, isCorrect ? 300 : 800)
  }, [correctAnswer, wrongAnswer])

  // Resetar seleções erradas
  const handleReset = useCallback(() => {
    setSelectedLeft(null)
    setSelectedRight(null)
  }, [])

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
            Conectados: {leftItems.filter(i => i.isMatched).length} de {leftItems.length}
          </span>
          <button
            onClick={handleReset}
            disabled={!selectedLeft && !selectedRight}
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-lg text-sm",
              "bg-secondary hover:bg-secondary/80 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Limpar
          </button>
        </div>

        {/* Área de conexão */}
        <div ref={containerRef} className="relative">
          {/* Grid de itens */}
          <div className="grid grid-cols-2 gap-8">
            {/* Coluna esquerda */}
            <div className="space-y-3">
              {leftItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  disabled={item.isMatched || !!feedback}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                    "flex items-center gap-2",
                    item.isMatched
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : selectedLeft === item.id
                        ? "border-accent bg-accent/20 scale-[1.02] shadow-lg"
                        : feedback?.leftId === item.id
                          ? feedback.type === 'correct'
                            ? "border-primary bg-primary/20"
                            : "border-destructive bg-destructive/20 animate-shake"
                          : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {item.isMatched && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  <span className="text-sm">{item.content}</span>
                </button>
              ))}
            </div>

            {/* Coluna direita */}
            <div className="space-y-3">
              {rightItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  disabled={item.isMatched || !!feedback}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                    "flex items-center gap-2",
                    item.isMatched
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : selectedRight === item.id
                        ? "border-accent bg-accent/20 scale-[1.02] shadow-lg"
                        : feedback?.rightId === item.id
                          ? feedback.type === 'correct'
                            ? "border-primary bg-primary/20"
                            : "border-destructive bg-destructive/20 animate-shake"
                          : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {item.isMatched && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  <span className="text-sm">{item.content}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Indicador de conexão */}
          {(selectedLeft || selectedRight) && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-accent/80 text-accent-foreground shadow-lg",
                "animate-bounce-in"
              )}>
                <Link2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {selectedLeft && selectedRight
                    ? 'Verificando...'
                    : 'Selecione o par'}
                </span>
              </div>
            </div>
          )}

          {/* Feedback visual */}
          {feedback && (
            <div className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "flex items-center gap-2 px-6 py-3 rounded-full shadow-xl",
              "animate-bounce-in z-10",
              feedback.type === 'correct'
                ? "bg-primary text-primary-foreground"
                : "bg-destructive text-destructive-foreground"
            )}>
              {feedback.type === 'correct' ? (
                <>
                  <Check className="h-6 w-6" />
                  <span className="font-bold">Correto!</span>
                </>
              ) : (
                <>
                  <X className="h-6 w-6" />
                  <span className="font-bold">Tente novamente!</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Instruções */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Selecione um item de cada coluna para conectá-los
        </p>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-primary">
              {connections.filter(c => c.isCorrect).length}
            </div>
            <div className="text-xs text-muted-foreground">Pares corretos</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-accent">
              {pairs.length - connections.filter(c => c.isCorrect).length}
            </div>
            <div className="text-xs text-muted-foreground">Restantes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
