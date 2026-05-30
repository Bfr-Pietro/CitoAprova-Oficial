'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { RotateCcw, Sparkles } from 'lucide-react'

interface CellMemoryGameProps {
  config: MinigameConfig
  pairs: Array<{
    id: string
    term: string
    match: string
    category: string
    hint?: string
  }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface Card {
  id: string
  content: string
  matchId: string
  type: 'term' | 'match'
  isFlipped: boolean
  isMatched: boolean
}

export function CellMemoryGame({ config, pairs, onComplete, onClose }: CellMemoryGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [lastMatch, setLastMatch] = useState<string | null>(null)
  const gameEndedRef = useRef(false)

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    
    // Criar cartas a partir dos pares
    const newCards: Card[] = []
    pairs.forEach(pair => {
      newCards.push({
        id: `term-${pair.id}`,
        content: pair.term,
        matchId: pair.id,
        type: 'term',
        isFlipped: false,
        isMatched: false
      })
      newCards.push({
        id: `match-${pair.id}`,
        content: pair.match,
        matchId: pair.id,
        type: 'match',
        isFlipped: false,
        isMatched: false
      })
    })

    // Embaralhar
    const shuffled = newCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setIsProcessing(false)
    setMatchedPairs(0)
    setAttempts(0)
    setLastMatch(null)
    startGame()
  }, [pairs, startGame])

  const handleCardClick = useCallback((cardId: string) => {
    if (!state.isActive || isProcessing) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    // Virar a carta
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    // Se duas cartas viradas
    if (newFlipped.length === 2) {
      setIsProcessing(true)
      setAttempts(prev => prev + 1)

      const [firstId, secondId] = newFlipped
      const firstCard = cards.find(c => c.id === firstId)!
      const secondCard = cards.find(c => c.id === secondId)!

      // Verificar match
      if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
        // Match correto!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.matchId === firstCard.matchId ? { ...c, isMatched: true } : c
          ))
          setFlippedCards([])
          setMatchedPairs(prev => prev + 1)
          setLastMatch(firstCard.matchId)
          
          // Bonus por eficiencia (menos tentativas = mais pontos)
          const efficiencyBonus = attempts < pairs.length ? 10 : 0
          correctAnswer(20 + efficiencyBonus)
          
          setIsProcessing(false)
        }, 600)
      } else {
        // Nao e match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ))
          setFlippedCards([])
          wrongAnswer(3)
          setIsProcessing(false)
        }, 1000)
      }
    }
  }, [state.isActive, isProcessing, cards, flippedCards, attempts, pairs.length, correctAnswer, wrongAnswer])

  // Verificar se completou
  useEffect(() => {
    if (matchedPairs === pairs.length && state.isActive) {
      if (!gameEndedRef.current) {
        gameEndedRef.current = true
        setTimeout(() => endGame(true), 500)
      }
    }
  }, [matchedPairs, pairs.length, state.isActive, endGame])

  const handleReset = useCallback(() => {
    const newCards: Card[] = []
    pairs.forEach(pair => {
      newCards.push({
        id: `term-${pair.id}`,
        content: pair.term,
        matchId: pair.id,
        type: 'term',
        isFlipped: false,
        isMatched: false
      })
      newCards.push({
        id: `match-${pair.id}`,
        content: pair.match,
        matchId: pair.id,
        type: 'match',
        isFlipped: false,
        isMatched: false
      })
    })
    const shuffled = newCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setIsProcessing(false)
    setMatchedPairs(0)
    setAttempts(0)
    setLastMatch(null)
  }, [pairs])

  const getMatchedPair = (matchId: string) => {
    return pairs.find(p => p.id === matchId)
  }

  // Determinar grid baseado no numero de cartas
  const getGridCols = () => {
    const totalCards = cards.length
    if (totalCards <= 8) return 'grid-cols-4'
    if (totalCards <= 12) return 'grid-cols-4 sm:grid-cols-4'
    return 'grid-cols-4 sm:grid-cols-5'
  }

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

        {/* Progresso */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Pares: {matchedPairs}/{pairs.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Tentativas: {attempts}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-accent-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </button>
        </div>

        {/* Ultimo match */}
        {lastMatch && (
          <div className="glass rounded-xl p-3 mb-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Par encontrado: {getMatchedPair(lastMatch)?.term} = {getMatchedPair(lastMatch)?.match}
              </span>
            </div>
          </div>
        )}

        {/* Grid de cartas */}
        <div className={cn("grid gap-2 sm:gap-3", getGridCols())}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || card.isFlipped || isProcessing}
              className={cn(
                "aspect-[3/4] rounded-xl transition-all duration-300 transform-gpu",
                "flex items-center justify-center p-2 text-center",
                "text-xs sm:text-sm font-medium",
                card.isMatched && "opacity-60 scale-95",
                card.isFlipped && !card.isMatched && "rotate-y-180",
                !card.isFlipped && !card.isMatched && "hover:scale-105 cursor-pointer"
              )}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {card.isFlipped || card.isMatched ? (
                <div className={cn(
                  "w-full h-full rounded-xl flex items-center justify-center p-2",
                  "border-2 transition-all",
                  card.type === 'term' 
                    ? "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/40"
                    : "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/40",
                  card.isMatched && "border-primary bg-primary/30"
                )}>
                  <span className={cn(
                    "text-foreground leading-tight",
                    card.isMatched && "text-primary"
                  )}>
                    {card.content}
                  </span>
                </div>
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-secondary to-muted border-2 border-border flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-lg">?</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Mensagem de conclusao */}
        {matchedPairs === pairs.length && (
          <div className="glass rounded-2xl p-6 mt-6 text-center animate-bounce-in">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold text-primary mb-2">
              Todos os pares encontrados!
            </h3>
            <p className="text-muted-foreground">
              Voce completou em {attempts} tentativas
            </p>
          </div>
        )}

        {/* Legenda */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary/40" />
            <span className="text-muted-foreground">Termo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent/20 border border-accent/40" />
            <span className="text-muted-foreground">Definicao/Funcao</span>
          </div>
        </div>
      </div>
    </div>
  )
}
