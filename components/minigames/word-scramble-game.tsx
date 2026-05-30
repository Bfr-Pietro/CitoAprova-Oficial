'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, RefreshCw, Lightbulb } from 'lucide-react'

interface WordScrambleGameProps {
  config: MinigameConfig
  words: Array<{ word: string; hint: string }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

// Função para embaralhar as letras de uma palavra
function scrambleWord(word: string): string {
  const letters = word.split('')
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  // Garantir que a palavra embaralhada é diferente da original
  const scrambled = letters.join('')
  if (scrambled === word && word.length > 1) {
    return scrambleWord(word)
  }
  return scrambled
}

export function WordScrambleGame({ config, words, onComplete, onClose }: WordScrambleGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [scrambledWord, setScrambledWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const gameEndedRef = useRef(false)

  const currentWord = words[currentWordIndex]

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setCurrentWordIndex(0)
    setUserInput('')
    setShowHint(false)
    setFeedback(null)
    setHintsUsed(0)
    if (words.length > 0) {
      setScrambledWord(scrambleWord(words[0].word.toUpperCase()))
    }
    startGame()
  }, [words, startGame])

  // Atualizar palavra embaralhada quando muda de palavra
  useEffect(() => {
    if (currentWord) {
      setScrambledWord(scrambleWord(currentWord.word.toUpperCase()))
      setShowHint(false)
      setUserInput('')
      setFeedback(null)
    }
  }, [currentWordIndex, currentWord])

  // Focar no input
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentWordIndex])

  const handleSubmit = useCallback(() => {
    if (!currentWord || !state.isActive || feedback) return

    const isCorrect = userInput.toUpperCase().trim() === currentWord.word.toUpperCase()

    if (isCorrect) {
      setFeedback('correct')
      // Bônus por não usar dica e por velocidade
      const hintPenalty = showHint ? 5 : 0
      correctAnswer(25 - hintPenalty)

      setTimeout(() => {
        if (currentWordIndex >= words.length - 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame(true)
          }
        } else {
          setCurrentWordIndex(prev => prev + 1)
        }
      }, 800)
    } else {
      setFeedback('wrong')
      wrongAnswer(5)
      setTimeout(() => {
        setFeedback(null)
        setUserInput('')
        inputRef.current?.focus()
      }, 800)
    }
  }, [currentWord, userInput, showHint, state.isActive, feedback, correctAnswer, wrongAnswer, currentWordIndex, words.length, endGame])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleReshuffle = () => {
    if (currentWord) {
      setScrambledWord(scrambleWord(currentWord.word.toUpperCase()))
    }
  }

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true)
      setHintsUsed(prev => prev + 1)
    }
  }

  if (!currentWord) return null

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
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            Palavra {currentWordIndex + 1} de {words.length}
          </span>
          <div className="flex gap-1">
            {words.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  i < currentWordIndex ? "bg-primary" :
                  i === currentWordIndex ? "bg-accent animate-pulse" :
                  "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Palavra embaralhada */}
        <div className={cn(
          "glass rounded-2xl p-8 mb-6 text-center",
          feedback === 'correct' && "border-2 border-primary bg-primary/10",
          feedback === 'wrong' && "border-2 border-destructive bg-destructive/10 animate-shake"
        )}>
          <div className="flex justify-center gap-2 mb-6">
            {scrambledWord.split('').map((letter, i) => (
              <div
                key={i}
                className={cn(
                  "w-10 h-12 flex items-center justify-center",
                  "bg-gradient-to-br from-accent to-primary",
                  "rounded-lg text-2xl font-bold text-primary-foreground",
                  "shadow-lg transform hover:scale-105 transition-transform",
                  "animate-bounce-in"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Dica */}
          {showHint && (
            <div className="bg-accent/20 rounded-lg p-3 mb-4 animate-slide-up">
              <p className="text-sm text-accent-foreground">
                <Lightbulb className="inline h-4 w-4 mr-1" />
                <strong>Dica:</strong> {currentWord.hint}
              </p>
            </div>
          )}

          {/* Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              disabled={!!feedback}
              placeholder="Digite a palavra..."
              className={cn(
                "w-full px-6 py-4 text-center text-xl font-semibold",
                "rounded-xl border-2 bg-card/80 backdrop-blur",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "transition-all duration-200",
                feedback === 'correct' && "border-primary",
                feedback === 'wrong' && "border-destructive",
                !feedback && "border-border focus:border-primary"
              )}
              autoComplete="off"
              autoCapitalize="characters"
            />
            {feedback === 'correct' && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Check className="h-6 w-6 text-primary animate-bounce-in" />
              </div>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleReshuffle}
            disabled={!!feedback}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl",
              "bg-secondary text-secondary-foreground",
              "hover:bg-secondary/80 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <RefreshCw className="h-5 w-5" />
            Embaralhar
          </button>
          <button
            onClick={handleShowHint}
            disabled={showHint || !!feedback}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl",
              "bg-accent/20 text-accent-foreground border border-accent/30",
              "hover:bg-accent/30 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Lightbulb className="h-5 w-5" />
            Dica {showHint ? '(usada)' : '(-5 pts)'}
          </button>
        </div>

        {/* Botão confirmar */}
        <button
          onClick={handleSubmit}
          disabled={!userInput.trim() || !!feedback}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg transition-all",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground",
            "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Confirmar
        </button>

        {/* Estatísticas */}
        <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <span>Dicas usadas: {hintsUsed}</span>
        </div>
      </div>
    </div>
  )
}
