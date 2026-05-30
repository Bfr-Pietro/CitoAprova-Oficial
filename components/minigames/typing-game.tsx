'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Keyboard, Check, X } from 'lucide-react'

interface TypingGameProps {
  config: MinigameConfig
  words: Array<{ word: string; definition: string }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function TypingGame({ config, words, onComplete, onClose }: TypingGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [totalCharsTyped, setTotalCharsTyped] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const gameEndedRef = useRef(false)

  const currentWord = words[currentWordIndex]

  // Calcular WPM (palavras por minuto)
  const calculateWPM = useCallback(() => {
    if (!startTime || totalCharsTyped === 0) return 0
    const timeInMinutes = (Date.now() - startTime) / 60000
    const wordsTyped = totalCharsTyped / 5 // Média de 5 caracteres por palavra
    return Math.round(wordsTyped / timeInMinutes)
  }, [startTime, totalCharsTyped])

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setCurrentWordIndex(0)
    setUserInput('')
    setFeedback(null)
    setWordsCompleted(0)
    setTotalCharsTyped(0)
    setStartTime(null)
    startGame()
  }, [startGame])

  // Focar no input
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentWordIndex])

  // Verificar input em tempo real
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (feedback || !state.isActive) return

    const value = e.target.value
    setUserInput(value)

    // Iniciar contador de tempo no primeiro caractere
    if (!startTime && value.length === 1) {
      setStartTime(Date.now())
    }

    // Verificar se completou a palavra
    if (value.toLowerCase() === currentWord.word.toLowerCase()) {
      setFeedback('correct')
      setTotalCharsTyped(prev => prev + currentWord.word.length)
      setWordsCompleted(prev => prev + 1)
      
      // Bônus por velocidade
      const wpm = calculateWPM()
      let bonus = 0
      if (wpm > 60) bonus = 15
      else if (wpm > 40) bonus = 10
      else if (wpm > 20) bonus = 5
      
      correctAnswer(20 + bonus)

      setTimeout(() => {
        if (currentWordIndex >= words.length - 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame(true)
          }
        } else {
          setCurrentWordIndex(prev => prev + 1)
          setUserInput('')
          setFeedback(null)
        }
      }, 600)
    }
  }, [feedback, state.isActive, startTime, currentWord, calculateWPM, correctAnswer, currentWordIndex, words.length, endGame])

  // Pular palavra (com penalidade)
  const handleSkip = useCallback(() => {
    if (feedback || !state.isActive) return

    setFeedback('wrong')
    wrongAnswer(10)

    setTimeout(() => {
      if (currentWordIndex >= words.length - 1) {
        if (!gameEndedRef.current) {
          gameEndedRef.current = true
          endGame()
        }
      } else {
        setCurrentWordIndex(prev => prev + 1)
        setUserInput('')
        setFeedback(null)
      }
    }, 600)
  }, [feedback, state.isActive, wrongAnswer, currentWordIndex, words.length, endGame])

  // Renderizar a palavra com destaque para caracteres corretos/errados
  const renderWord = () => {
    return currentWord.word.split('').map((char, index) => {
      const inputChar = userInput[index]
      let className = 'text-muted-foreground'
      
      if (inputChar !== undefined) {
        if (inputChar.toLowerCase() === char.toLowerCase()) {
          className = 'text-primary font-bold'
        } else {
          className = 'text-destructive font-bold bg-destructive/20 rounded'
        }
      }
      
      return (
        <span key={index} className={cn("text-3xl transition-colors", className)}>
          {char}
        </span>
      )
    })
  }

  if (!currentWord) return null

  const wpm = calculateWPM()

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

        {/* Estatísticas */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-primary" />
            <span>{wpm} PPM</span>
          </div>
          <div className="text-muted-foreground">
            Palavra {currentWordIndex + 1} de {words.length}
          </div>
        </div>

        {/* Progresso */}
        <div className="flex gap-1 justify-center mb-6">
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

        {/* Área da palavra */}
        <div className={cn(
          "glass rounded-2xl p-8 mb-6 text-center",
          feedback === 'correct' && "border-2 border-primary bg-primary/10",
          feedback === 'wrong' && "border-2 border-destructive bg-destructive/10"
        )}>
          {/* Definição como dica */}
          <div className="text-sm text-muted-foreground mb-4 italic">
            &quot;{currentWord.definition}&quot;
          </div>

          {/* Palavra para digitar */}
          <div className="flex justify-center gap-0.5 mb-6 flex-wrap">
            {renderWord()}
          </div>

          {/* Feedback visual */}
          {feedback && (
            <div className={cn(
              "flex items-center justify-center gap-2 mb-4 animate-bounce-in",
              feedback === 'correct' ? "text-primary" : "text-destructive"
            )}>
              {feedback === 'correct' ? (
                <>
                  <Check className="h-6 w-6" />
                  <span className="font-bold">Correto!</span>
                </>
              ) : (
                <>
                  <X className="h-6 w-6" />
                  <span className="font-bold">Pulado!</span>
                </>
              )}
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={!!feedback}
            placeholder="Digite aqui..."
            className={cn(
              "w-full px-6 py-4 text-center text-xl font-mono",
              "rounded-xl border-2 bg-card/80 backdrop-blur",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "transition-all duration-200",
              "placeholder:text-muted-foreground/50",
              feedback === 'correct' && "border-primary",
              feedback === 'wrong' && "border-destructive",
              !feedback && "border-border focus:border-primary"
            )}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {/* Botão pular */}
        <button
          onClick={handleSkip}
          disabled={!!feedback}
          className={cn(
            "w-full py-3 rounded-xl font-medium transition-all",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/80",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Pular palavra (-10 pts)
        </button>

        {/* Estatísticas extras */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-primary">{wordsCompleted}</div>
            <div className="text-xs text-muted-foreground">Palavras completas</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-accent">{totalCharsTyped}</div>
            <div className="text-xs text-muted-foreground">Caracteres digitados</div>
          </div>
        </div>
      </div>
    </div>
  )
}
