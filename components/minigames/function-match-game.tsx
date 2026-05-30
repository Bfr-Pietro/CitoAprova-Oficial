'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, X, ArrowRight, Sparkles } from 'lucide-react'

interface FunctionMatchGameProps {
  config: MinigameConfig
  pairs: Array<{
    id: string
    organelle: string
    function: string
    category: string
    hint?: string
  }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface MatchLine {
  leftId: string
  rightId: string
  isCorrect: boolean
}

export function FunctionMatchGame({ config, pairs, onComplete, onClose }: FunctionMatchGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [leftItems, setLeftItems] = useState<Array<{ id: string; content: string; isMatched: boolean }>>([])
  const [rightItems, setRightItems] = useState<Array<{ id: string; content: string; isMatched: boolean }>>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchLine[]>([])
  const [showFeedback, setShowFeedback] = useState<{ leftId: string; rightId: string; isCorrect: boolean } | null>(null)
  const [streak, setStreak] = useState(0)
  const gameEndedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    
    // Criar items da esquerda (organelas) e direita (funcoes) embaralhados separadamente
    const left = pairs.map(p => ({
      id: `left-${p.id}`,
      content: p.organelle,
      isMatched: false
    })).sort(() => Math.random() - 0.5)

    const right = pairs.map(p => ({
      id: `right-${p.id}`,
      content: p.function,
      isMatched: false
    })).sort(() => Math.random() - 0.5)

    setLeftItems(left)
    setRightItems(right)
    setSelectedLeft(null)
    setMatches([])
    setShowFeedback(null)
    setStreak(0)
    startGame()
  }, [pairs, startGame])

  const handleSelectLeft = useCallback((id: string) => {
    if (!state.isActive) return
    const item = leftItems.find(i => i.id === id)
    if (item?.isMatched) return
    setSelectedLeft(prev => prev === id ? null : id)
  }, [state.isActive, leftItems])

  const handleSelectRight = useCallback((rightId: string) => {
    if (!selectedLeft || !state.isActive) return

    const rightItem = rightItems.find(i => i.id === rightId)
    if (rightItem?.isMatched) return

    // Extrair IDs originais
    const leftOriginalId = selectedLeft.replace('left-', '')
    const rightOriginalId = rightId.replace('right-', '')

    // Verificar se e um match correto
    const isCorrect = leftOriginalId === rightOriginalId

    setShowFeedback({ leftId: selectedLeft, rightId, isCorrect })

    if (isCorrect) {
      // Marcar como matched
      setLeftItems(prev => prev.map(i => 
        i.id === selectedLeft ? { ...i, isMatched: true } : i
      ))
      setRightItems(prev => prev.map(i => 
        i.id === rightId ? { ...i, isMatched: true } : i
      ))

      // Adicionar linha de conexao
      setMatches(prev => [...prev, { leftId: selectedLeft, rightId, isCorrect: true }])

      // Pontuacao com bonus de streak
      const streakBonus = Math.min(streak, 5) * 5
      correctAnswer(25 + streakBonus)
      setStreak(prev => prev + 1)
    } else {
      wrongAnswer(5)
      setStreak(0)
    }

    // Limpar selecao apos feedback
    setTimeout(() => {
      setSelectedLeft(null)
      setShowFeedback(null)
    }, isCorrect ? 500 : 1000)
  }, [selectedLeft, state.isActive, rightItems, correctAnswer, wrongAnswer, streak])

  // Verificar se completou
  useEffect(() => {
    const allMatched = leftItems.length > 0 && leftItems.every(i => i.isMatched)
    if (allMatched && state.isActive) {
      if (!gameEndedRef.current) {
        gameEndedRef.current = true
        setTimeout(() => endGame(true), 500)
      }
    }
  }, [leftItems, state.isActive, endGame])

  const getItemFeedback = (id: string) => {
    if (!showFeedback) return null
    if (showFeedback.leftId === id || showFeedback.rightId === id) {
      return showFeedback.isCorrect
    }
    return null
  }

  const matchedCount = leftItems.filter(i => i.isMatched).length

  return (
    <div className="min-h-screen bg-background bg-cell-pattern p-4">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={config.title}
          score={state.score}
          targetScore={config.targetScore}
          timeRemaining={state.timeRemaining}
          timeLimit={config.timeLimit}
          combo={state.combo}
          onClose={onClose}
        />

        <p className="text-center text-muted-foreground mb-2 text-sm">
          {config.description}
        </p>

        {/* Progresso e streak */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Conectados: {matchedCount}/{pairs.length}
          </span>
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-chart-4/20 rounded-full animate-bounce-in">
              <Sparkles className="h-3 w-3 text-chart-4" />
              <span className="text-sm font-bold text-chart-4">{streak}x combo!</span>
            </div>
          )}
        </div>

        {/* Instrucao */}
        <div className="glass rounded-xl p-3 mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Clique em uma organela</span>
          <ArrowRight className="h-4 w-4" />
          <span>depois na sua funcao</span>
        </div>

        {/* Area de matching */}
        <div ref={containerRef} className="glass rounded-2xl p-4 relative">
          <div className="flex justify-between gap-4">
            {/* Coluna esquerda - Organelas */}
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 text-center uppercase tracking-wider">
                Organelas
              </h4>
              {leftItems.map(item => {
                const feedback = getItemFeedback(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectLeft(item.id)}
                    disabled={item.isMatched}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all duration-200",
                      "text-sm font-medium text-left",
                      item.isMatched && "opacity-50 border-primary/30 bg-primary/10",
                      selectedLeft === item.id && !item.isMatched && "border-primary bg-primary/20 shadow-lg scale-[1.02]",
                      feedback === true && "border-primary bg-primary/30 animate-pulse",
                      feedback === false && "border-destructive bg-destructive/20 animate-shake",
                      !item.isMatched && selectedLeft !== item.id && feedback === null && "border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.isMatched ? (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex-shrink-0",
                          selectedLeft === item.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )} />
                      )}
                      <span className={item.isMatched ? "text-primary" : "text-foreground"}>
                        {item.content}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Coluna central - Visual de conexao */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent" />
            </div>

            {/* Coluna direita - Funcoes */}
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 text-center uppercase tracking-wider">
                Funcoes
              </h4>
              {rightItems.map(item => {
                const feedback = getItemFeedback(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectRight(item.id)}
                    disabled={item.isMatched || !selectedLeft}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all duration-200",
                      "text-sm font-medium text-left",
                      item.isMatched && "opacity-50 border-accent/30 bg-accent/10",
                      feedback === true && "border-primary bg-primary/30 animate-pulse",
                      feedback === false && "border-destructive bg-destructive/20 animate-shake",
                      !item.isMatched && selectedLeft && feedback === null && "border-border hover:border-accent/50 hover:bg-accent/5 cursor-pointer",
                      !item.isMatched && !selectedLeft && "border-border opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.isMatched ? (
                        <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      ) : feedback === false ? (
                        <X className="h-4 w-4 text-destructive flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                      )}
                      <span className={item.isMatched ? "text-accent-foreground" : "text-foreground"}>
                        {item.content}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pares conectados */}
        {matchedCount > 0 && (
          <div className="mt-4 glass rounded-xl p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Pares conectados:
            </h4>
            <div className="flex flex-wrap gap-2">
              {matches.map((match, index) => {
                const leftItem = leftItems.find(i => i.id === match.leftId)
                const rightItem = rightItems.find(i => i.id === match.rightId)
                return (
                  <div
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm animate-bounce-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="font-medium text-primary">{leftItem?.content}</span>
                    <span className="text-muted-foreground mx-1">=</span>
                    <span className="text-accent-foreground">{rightItem?.content}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Mensagem de conclusao */}
        {matchedCount === pairs.length && (
          <div className="glass rounded-2xl p-6 mt-4 text-center animate-bounce-in">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold text-primary">
              Todos conectados corretamente!
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}
