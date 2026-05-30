'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'

interface MemoryCard {
  id: string
  content: string
  matchId: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  config: MinigameConfig
  pairs: Array<{ id: string; item1: string; item2: string }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function MemoryGame({ config, pairs, onComplete, onClose }: MemoryGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [canFlip, setCanFlip] = useState(true)
  const isCheckingRef = useRef(false)
  const gameEndedRef = useRef(false)

  // Inicializar cartas
  useEffect(() => {
    // Reset refs ao iniciar novo jogo
    isCheckingRef.current = false
    gameEndedRef.current = false
    
    const allCards: MemoryCard[] = []
    pairs.forEach(pair => {
      allCards.push({
        id: `${pair.id}-1`,
        content: pair.item1,
        matchId: pair.id,
        isFlipped: false,
        isMatched: false
      })
      allCards.push({
        id: `${pair.id}-2`,
        content: pair.item2,
        matchId: pair.id,
        isFlipped: false,
        isMatched: false
      })
    })
    // Embaralhar
    const shuffled = allCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    startGame()
  }, [pairs, startGame])

  const handleCardClick = useCallback((cardId: string) => {
    if (!canFlip || !state.isActive) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    // Virar carta
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))
    setFlippedCards(prev => [...prev, cardId])
  }, [canFlip, state.isActive, cards])

  // Verificar match quando duas cartas estao viradas
  useEffect(() => {
    if (flippedCards.length !== 2 || isCheckingRef.current) return

    isCheckingRef.current = true
    setCanFlip(false)
    const [id1, id2] = flippedCards
    const card1 = cards.find(c => c.id === id1)
    const card2 = cards.find(c => c.id === id2)

    if (card1 && card2 && card1.matchId === card2.matchId) {
      // Match!
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.matchId === card1.matchId ? { ...c, isMatched: true } : c
        ))
        correctAnswer(20)
        setFlippedCards([])
        setCanFlip(true)
        isCheckingRef.current = false
      }, 500)
    } else {
      // No match
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          flippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
        ))
        wrongAnswer(5)
        setFlippedCards([])
        setCanFlip(true)
        isCheckingRef.current = false
      }, 1000)
    }
  }, [flippedCards, cards, correctAnswer, wrongAnswer])

  // Verificar se todas as cartas foram combinadas
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && !gameEndedRef.current) {
      gameEndedRef.current = true
      setTimeout(() => endGame(true), 500)
    }
  }, [cards, endGame])

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

        {/* Grid de cartas */}
        <div className="grid grid-cols-4 gap-2">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={!canFlip || card.isFlipped || card.isMatched}
              className={cn(
                "aspect-square rounded-xl text-xs font-medium p-2 transition-all duration-300",
                "flex items-center justify-center text-center",
                card.isMatched
                  ? "bg-primary/20 border-2 border-primary text-primary scale-95"
                  : card.isFlipped
                    ? "bg-card border-2 border-accent text-foreground shadow-lg"
                    : "bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-105 active:scale-95 cursor-pointer"
              )}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="break-words">{card.content}</span>
              ) : (
                <span className="text-2xl">?</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
