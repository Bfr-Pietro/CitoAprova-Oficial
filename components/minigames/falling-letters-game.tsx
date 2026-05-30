'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Clock, Target, Zap, Check } from 'lucide-react'

interface FallingLettersGameProps {
  config: MinigameConfig
  words: { word: string; hint: string }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface FallingLetter {
  id: string
  letter: string
  x: number
  y: number
  speed: number
  isCorrect: boolean
}

export function FallingLettersGame({ config, words, onComplete, onClose }: FallingLettersGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [collectedLetters, setCollectedLetters] = useState<string[]>([])
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([])
  const [combo, setCombo] = useState(0)
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastSpawnRef = useRef(0)

  const currentWord = words[currentWordIndex % words.length]
  const targetLetters = currentWord.word.toUpperCase().split('')
  const nextNeededLetter = targetLetters[collectedLetters.length]

  const spawnLetter = useCallback(() => {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÎÔÛÃÕÇ'
    const isCorrectChance = Math.random() < 0.4
    
    let letter: string
    if (isCorrectChance && nextNeededLetter) {
      letter = nextNeededLetter
    } else {
      const remainingNeeded = targetLetters.slice(collectedLetters.length)
      const wrongLetters = allLetters.split('').filter(l => !remainingNeeded.includes(l))
      letter = wrongLetters[Math.floor(Math.random() * wrongLetters.length)]
    }

    const newLetter: FallingLetter = {
      id: `${Date.now()}-${Math.random()}`,
      letter,
      x: 10 + Math.random() * 80,
      y: -10,
      speed: 0.4 + Math.random() * 0.3,
      isCorrect: letter === nextNeededLetter
    }
    setFallingLetters(prev => [...prev, newLetter])
  }, [nextNeededLetter, targetLetters, collectedLetters.length])

  const handleCatch = useCallback((letter: FallingLetter) => {
    if (gameState !== 'playing') return

    if (letter.letter === nextNeededLetter) {
      const comboBonus = Math.min(combo, 5) * 5
      const points = 15 + comboBonus
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setCollectedLetters(prev => [...prev, letter.letter])
      setShowFeedback('correct')
      setFallingLetters(prev => prev.filter(l => l.id !== letter.id))

      // Verificar se completou a palavra
      if (collectedLetters.length + 1 >= targetLetters.length) {
        setScore(prev => prev + 50) // Bônus por completar a palavra
        setTimeout(() => {
          setCollectedLetters([])
          setCurrentWordIndex(prev => prev + 1)
        }, 500)
      }
    } else {
      setCombo(0)
      setShowFeedback('wrong')
    }

    setTimeout(() => setShowFeedback(null), 300)
  }, [gameState, nextNeededLetter, combo, collectedLetters.length, targetLetters.length])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastSpawnRef.current > 800) {
        spawnLetter()
        lastSpawnRef.current = timestamp
      }

      setFallingLetters(prev => 
        prev
          .map(letter => ({ ...letter, y: letter.y + letter.speed }))
          .filter(letter => letter.y < 110)
      )

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameState, spawnLetter])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          const success = score >= config.targetScore
          setGameState(success ? 'success' : 'failed')
          setTimeout(() => onComplete(success, score), 1500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, score, config.targetScore, onComplete])

  // Check success
  useEffect(() => {
    if (score >= config.targetScore && gameState === 'playing') {
      setGameState('success')
      setTimeout(() => onComplete(true, score), 1500)
    }
  }, [score, config.targetScore, gameState, onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-black/30">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 bg-yellow-500/20 px-2 sm:px-3 py-1 rounded-full">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm sm:text-base">{score}/{config.targetScore}</span>
          </div>
          {combo > 2 && (
            <div className="flex items-center gap-1 bg-orange-500/30 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
              <span className="text-orange-400 font-bold text-xs sm:text-sm">x{combo}</span>
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-2 bg-blue-500/20 px-2 sm:px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-blue-400 font-bold text-sm sm:text-base">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Palavra atual */}
      <div className="px-4 py-3 bg-black/20">
        <p className="text-white/70 text-xs sm:text-sm text-center mb-2">
          💡 {currentWord.hint}
        </p>
        <div className="flex justify-center gap-1 sm:gap-2">
          {targetLetters.map((letter, index) => (
            <div
              key={index}
              className={`w-8 h-10 sm:w-10 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold border-2 ${
                index < collectedLetters.length
                  ? 'bg-green-500 border-green-400 text-white'
                  : index === collectedLetters.length
                  ? 'bg-yellow-500/30 border-yellow-400 text-yellow-400 animate-pulse'
                  : 'bg-white/10 border-white/30 text-white/50'
              }`}
            >
              {index < collectedLetters.length ? collectedLetters[index] : letter}
            </div>
          ))}
        </div>
      </div>

      {/* Área do jogo */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {fallingLetters.map(letter => (
            <motion.button
              key={letter.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleCatch(letter)}
              className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg transition-transform active:scale-90 ${
                letter.isCorrect
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white ring-2 ring-green-300'
                  : 'bg-gradient-to-br from-slate-500 to-slate-700 text-white'
              }`}
              style={{
                left: `calc(${letter.x}% - 24px)`,
                top: `${letter.y}%`
              }}
            >
              {letter.letter}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                showFeedback === 'correct' ? 'bg-green-500/50' : 'bg-red-500/50'
              }`}>
                {showFeedback === 'correct' ? (
                  <Check className="w-12 h-12 text-white" />
                ) : (
                  <X className="w-12 h-12 text-white" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game over overlay */}
      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className={`text-center p-6 sm:p-8 rounded-2xl ${
                gameState === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              <div className="text-5xl sm:text-6xl mb-4">
                {gameState === 'success' ? '🎉' : '😢'}
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                gameState === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState === 'success' ? 'Parabéns!' : 'Tente Novamente'}
              </h2>
              <p className="text-white text-lg sm:text-xl">Pontuação: {score}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
