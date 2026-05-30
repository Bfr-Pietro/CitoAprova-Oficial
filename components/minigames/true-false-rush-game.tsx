'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Check, Clock, Target, ThumbsUp, ThumbsDown, Zap } from 'lucide-react'

interface TrueFalseRushGameProps {
  config: MinigameConfig
  statements: { text: string; isTrue: boolean; explanation?: string }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function TrueFalseRushGame({ config, statements, onComplete, onClose }: TrueFalseRushGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [shuffledStatements, setShuffledStatements] = useState<typeof statements>([])

  // Shuffle statements on mount
  useEffect(() => {
    setShuffledStatements([...statements].sort(() => Math.random() - 0.5))
  }, [statements])

  const currentStatement = shuffledStatements[currentIndex]

  const handleAnswer = useCallback((answer: boolean) => {
    if (gameState !== 'playing' || !currentStatement || feedback) return

    const isCorrect = answer === currentStatement.isTrue

    if (isCorrect) {
      const comboBonus = Math.min(combo, 10) * 3
      const timeBonus = Math.floor(timeLeft / 5)
      const points = 15 + comboBonus + timeBonus
      setScore(prev => prev + points)
      setCombo(prev => {
        const newCombo = prev + 1
        if (newCombo > maxCombo) setMaxCombo(newCombo)
        return newCombo
      })
      setFeedback('correct')
    } else {
      setCombo(0)
      setFeedback('wrong')
      setShowExplanation(true)
    }

    setTimeout(() => {
      setFeedback(null)
      setShowExplanation(false)
      if (currentIndex < shuffledStatements.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        // Reciclar perguntas
        setShuffledStatements(prev => [...prev].sort(() => Math.random() - 0.5))
        setCurrentIndex(0)
      }
    }, isCorrect ? 800 : 2000)
  }, [gameState, currentStatement, feedback, combo, maxCombo, timeLeft, currentIndex, shuffledStatements.length])

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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        handleAnswer(false)
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        handleAnswer(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAnswer])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
            <Target className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">{score}/{config.targetScore}</span>
          </div>
          {combo > 2 && (
            <div className="flex items-center gap-1 bg-orange-500/30 px-2 py-1 rounded-full">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-bold text-sm">x{combo}</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(score / config.targetScore) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {currentStatement && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`relative max-w-lg w-full p-6 rounded-2xl shadow-2xl ${
                feedback === 'correct'
                  ? 'bg-green-500/30 ring-4 ring-green-400'
                  : feedback === 'wrong'
                  ? 'bg-red-500/30 ring-4 ring-red-400'
                  : 'bg-white/10 backdrop-blur-sm'
              }`}
            >
              <p className="text-white text-xl md:text-2xl text-center font-medium leading-relaxed">
                {currentStatement.text}
              </p>

              {/* Explanation on wrong answer */}
              <AnimatePresence>
                {showExplanation && currentStatement.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/20"
                  >
                    <p className="text-yellow-300 text-sm text-center">
                      💡 {currentStatement.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer buttons */}
        <div className="flex gap-8 mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(false)}
            disabled={feedback !== null}
            className={`flex flex-col items-center gap-2 px-8 py-6 rounded-2xl transition-all ${
              feedback === 'wrong' && !currentStatement?.isTrue
                ? 'bg-red-500 scale-110'
                : feedback === 'correct' && !currentStatement?.isTrue
                ? 'bg-green-500 scale-110'
                : 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600'
            } ${feedback !== null ? 'opacity-70' : ''}`}
          >
            <ThumbsDown className="w-10 h-10 text-white" />
            <span className="text-white font-bold text-lg">FALSO</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(true)}
            disabled={feedback !== null}
            className={`flex flex-col items-center gap-2 px-8 py-6 rounded-2xl transition-all ${
              feedback === 'wrong' && currentStatement?.isTrue
                ? 'bg-red-500 scale-110'
                : feedback === 'correct' && currentStatement?.isTrue
                ? 'bg-green-500 scale-110'
                : 'bg-gradient-to-br from-green-500 to-green-700 hover:from-green-400 hover:to-green-600'
            } ${feedback !== null ? 'opacity-70' : ''}`}
          >
            <ThumbsUp className="w-10 h-10 text-white" />
            <span className="text-white font-bold text-lg">VERDADEIRO</span>
          </motion.button>
        </div>

        {/* Instructions */}
        <p className="text-white/50 text-sm mt-6">
          Use as setas ← → ou clique nos botões
        </p>
      </div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                feedback === 'correct' ? 'bg-green-500/50' : 'bg-red-500/50'
              }`}
            >
              {feedback === 'correct' ? (
                <Check className="w-20 h-20 text-white" />
              ) : (
                <X className="w-20 h-20 text-white" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className={`text-center p-8 rounded-2xl ${
                gameState === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              <div className={`text-6xl mb-4 ${
                gameState === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState === 'success' ? '🎉' : '😢'}
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                gameState === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState === 'success' ? 'Excelente!' : 'Tente Novamente'}
              </h2>
              <p className="text-white text-xl">Pontuação: {score}</p>
              {maxCombo > 2 && (
                <p className="text-orange-400 text-lg mt-2">
                  Maior combo: {maxCombo}x
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
