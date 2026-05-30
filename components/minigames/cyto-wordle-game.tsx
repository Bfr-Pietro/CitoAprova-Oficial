'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Delete, CornerDownLeft, Lightbulb } from 'lucide-react'

interface CytoWordleGameProps {
  config: MinigameConfig
  words: Array<{ word: string; hint: string; category: string }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'pending'

interface LetterState {
  letter: string
  status: LetterStatus
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
]

export function CytoWordleGame({ config, words, onComplete, onClose }: CytoWordleGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [guesses, setGuesses] = useState<LetterState[][]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [shake, setShake] = useState(false)
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({})
  const [gameWon, setGameWon] = useState(false)
  const [revealRow, setRevealRow] = useState(-1)
  const gameEndedRef = useRef(false)

  const currentWord = words[currentWordIndex]
  const maxAttempts = 6
  const wordLength = currentWord?.word.length || 5

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setCurrentWordIndex(0)
    setGuesses([])
    setCurrentGuess('')
    setShowHint(false)
    setLetterStatuses({})
    setGameWon(false)
    setRevealRow(-1)
    startGame()
  }, [words, startGame])

  // Reset para nova palavra
  useEffect(() => {
    if (currentWord) {
      setGuesses([])
      setCurrentGuess('')
      setShowHint(false)
      setLetterStatuses({})
      setGameWon(false)
      setRevealRow(-1)
    }
  }, [currentWordIndex, currentWord])

  const checkGuess = useCallback((guess: string): LetterState[] => {
    const target = currentWord.word.toUpperCase()
    const result: LetterState[] = []
    const targetLetters = target.split('')
    const guessLetters = guess.toUpperCase().split('')
    const usedIndices: Set<number> = new Set()

    // Primeiro passo: marcar letras corretas (posição certa)
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = { letter, status: 'correct' }
        usedIndices.add(i)
      }
    })

    // Segundo passo: marcar letras presentes (posição errada)
    guessLetters.forEach((letter, i) => {
      if (result[i]) return

      const foundIndex = targetLetters.findIndex((l, j) => l === letter && !usedIndices.has(j))
      if (foundIndex !== -1) {
        result[i] = { letter, status: 'present' }
        usedIndices.add(foundIndex)
      } else {
        result[i] = { letter, status: 'absent' }
      }
    })

    return result
  }, [currentWord])

  const submitGuess = useCallback(() => {
    if (!currentWord || !state.isActive || currentGuess.length !== wordLength) return

    const result = checkGuess(currentGuess)
    const newGuesses = [...guesses, result]
    setGuesses(newGuesses)
    setRevealRow(newGuesses.length - 1)

    // Atualizar status das letras do teclado
    const newLetterStatuses = { ...letterStatuses }
    result.forEach(({ letter, status }) => {
      const currentStatus = newLetterStatuses[letter]
      if (status === 'correct') {
        newLetterStatuses[letter] = 'correct'
      } else if (status === 'present' && currentStatus !== 'correct') {
        newLetterStatuses[letter] = 'present'
      } else if (!currentStatus) {
        newLetterStatuses[letter] = status
      }
    })
    setLetterStatuses(newLetterStatuses)

    // Verificar vitoria
    const isCorrect = currentGuess.toUpperCase() === currentWord.word.toUpperCase()

    if (isCorrect) {
      setGameWon(true)
      // Bonus por numero de tentativas (menos tentativas = mais pontos)
      const attemptBonus = (maxAttempts - newGuesses.length + 1) * 10
      const hintPenalty = showHint ? 15 : 0
      correctAnswer(50 + attemptBonus - hintPenalty)

      setTimeout(() => {
        if (currentWordIndex >= words.length - 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame(true)
          }
        } else {
          setCurrentWordIndex(prev => prev + 1)
        }
      }, 1500)
    } else if (newGuesses.length >= maxAttempts) {
      // Perdeu esta palavra
      wrongAnswer(10)
      setTimeout(() => {
        if (currentWordIndex >= words.length - 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame()
          }
        } else {
          setCurrentWordIndex(prev => prev + 1)
        }
      }, 1500)
    }

    setCurrentGuess('')
  }, [currentWord, currentGuess, wordLength, guesses, letterStatuses, showHint, state.isActive, checkGuess, correctAnswer, wrongAnswer, currentWordIndex, words.length, endGame])

  const handleKeyPress = useCallback((key: string) => {
    if (!state.isActive || gameWon) return

    if (key === 'ENTER') {
      if (currentGuess.length === wordLength) {
        submitGuess()
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (currentGuess.length < wordLength && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key)
    }
  }, [state.isActive, gameWon, currentGuess, wordLength, submitGuess])

  // Teclado fisico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACK')
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  const getLetterClass = (status: LetterStatus, isRevealing: boolean, delay: number) => {
    const baseClass = "w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-lg sm:text-xl font-bold rounded-lg border-2 transition-all"
    
    if (isRevealing) {
      return cn(
        baseClass,
        "animate-flip",
        status === 'correct' && "bg-primary border-primary text-primary-foreground",
        status === 'present' && "bg-chart-3 border-chart-3 text-primary-foreground",
        status === 'absent' && "bg-muted border-muted text-muted-foreground"
      )
    }

    return cn(
      baseClass,
      status === 'correct' && "bg-primary border-primary text-primary-foreground",
      status === 'present' && "bg-chart-3 border-chart-3 text-primary-foreground",
      status === 'absent' && "bg-muted border-muted text-muted-foreground",
      status === 'empty' && "border-border bg-card",
      status === 'pending' && "border-primary/50 bg-card animate-pulse"
    )
  }

  const getKeyClass = (key: string) => {
    const status = letterStatuses[key]
    const baseClass = "h-12 sm:h-14 rounded-lg font-bold text-sm sm:text-base transition-all active:scale-95"
    
    if (key === 'ENTER' || key === 'BACK') {
      return cn(baseClass, "w-14 sm:w-16 bg-accent text-accent-foreground hover:bg-accent/80")
    }

    return cn(
      baseClass,
      "w-8 sm:w-10",
      status === 'correct' && "bg-primary text-primary-foreground",
      status === 'present' && "bg-chart-3 text-primary-foreground",
      status === 'absent' && "bg-muted/50 text-muted-foreground",
      !status && "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    )
  }

  if (!currentWord) return null

  // Construir grid de tentativas
  const rows: LetterState[][] = []
  for (let i = 0; i < maxAttempts; i++) {
    if (i < guesses.length) {
      rows.push(guesses[i])
    } else if (i === guesses.length) {
      // Linha atual
      const currentRow: LetterState[] = []
      for (let j = 0; j < wordLength; j++) {
        currentRow.push({
          letter: currentGuess[j] || '',
          status: currentGuess[j] ? 'pending' : 'empty'
        })
      }
      rows.push(currentRow)
    } else {
      // Linhas vazias
      rows.push(Array(wordLength).fill({ letter: '', status: 'empty' }))
    }
  }

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

        <p className="text-center text-muted-foreground mb-2 text-sm">
          {config.description}
        </p>

        {/* Progresso das palavras */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            Palavra {currentWordIndex + 1}/{words.length}
          </span>
          <span className="px-2 py-0.5 bg-accent/20 rounded-full text-xs text-accent-foreground">
            {currentWord.category}
          </span>
        </div>

        {/* Grid de tentativas */}
        <div className={cn("glass rounded-2xl p-4 mb-4", shake && "animate-shake")}>
          <div className="flex flex-col items-center gap-1.5">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1.5">
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={getLetterClass(
                      cell.status,
                      rowIndex === revealRow,
                      cellIndex * 150
                    )}
                    style={rowIndex === revealRow ? { animationDelay: `${cellIndex * 150}ms` } : {}}
                  >
                    {cell.letter}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Resultado */}
          {gameWon && (
            <div className="mt-4 text-center animate-bounce-in">
              <span className="text-lg font-bold text-primary">Correto!</span>
            </div>
          )}
          {guesses.length >= maxAttempts && !gameWon && (
            <div className="mt-4 text-center animate-slide-up">
              <span className="text-muted-foreground">Resposta: </span>
              <span className="font-bold text-primary">{currentWord.word}</span>
            </div>
          )}
        </div>

        {/* Dica */}
        <button
          onClick={() => setShowHint(true)}
          disabled={showHint || gameWon}
          className={cn(
            "w-full mb-4 py-3 rounded-xl flex items-center justify-center gap-2",
            "bg-accent/20 text-accent-foreground border border-accent/30",
            "hover:bg-accent/30 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Lightbulb className="h-5 w-5" />
          {showHint ? currentWord.hint : 'Ver dica (-15 pts)'}
        </button>

        {/* Teclado virtual */}
        <div className="flex flex-col items-center gap-1.5">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  disabled={!state.isActive || gameWon}
                  className={getKeyClass(key)}
                >
                  {key === 'BACK' ? <Delete className="h-5 w-5" /> : 
                   key === 'ENTER' ? <CornerDownLeft className="h-5 w-5" /> : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
