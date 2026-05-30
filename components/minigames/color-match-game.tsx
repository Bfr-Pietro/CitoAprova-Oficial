'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Clock, Target, Zap, Check } from 'lucide-react'

interface ColorMatchGameProps {
  config: MinigameConfig
  items: { content: string; category: string }[]
  categories: { name: string; color: string }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function ColorMatchGame({ config, items, categories, onComplete, onClose }: ColorMatchGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [combo, setCombo] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; categoryIndex: number } | null>(null)
  const [shuffledItems, setShuffledItems] = useState<typeof items>([])

  useEffect(() => {
    setShuffledItems([...items].sort(() => Math.random() - 0.5))
  }, [items])

  const currentItem = shuffledItems[currentItemIndex]

  const handleCategorySelect = useCallback((categoryName: string, categoryIndex: number) => {
    if (gameState !== 'playing' || !currentItem || feedback) return

    const isCorrect = currentItem.category === categoryName

    if (isCorrect) {
      const comboBonus = Math.min(combo, 8) * 4
      const points = 20 + comboBonus
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setFeedback({ type: 'correct', categoryIndex })
    } else {
      setCombo(0)
      setFeedback({ type: 'wrong', categoryIndex })
    }

    setTimeout(() => {
      setFeedback(null)
      if (currentItemIndex < shuffledItems.length - 1) {
        setCurrentItemIndex(prev => prev + 1)
      } else {
        setShuffledItems(prev => [...prev].sort(() => Math.random() - 0.5))
        setCurrentItemIndex(0)
      }
    }, 600)
  }, [gameState, currentItem, feedback, combo, currentItemIndex, shuffledItems.length])

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

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'from-red-500 to-red-700 border-red-400',
      blue: 'from-blue-500 to-blue-700 border-blue-400',
      green: 'from-green-500 to-green-700 border-green-400',
      yellow: 'from-yellow-500 to-yellow-700 border-yellow-400',
      purple: 'from-purple-500 to-purple-700 border-purple-400',
      orange: 'from-orange-500 to-orange-700 border-orange-400',
      pink: 'from-pink-500 to-pink-700 border-pink-400',
      cyan: 'from-cyan-500 to-cyan-700 border-cyan-400'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 flex flex-col z-50">
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

      {/* Progress bar */}
      <div className="h-2 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(score / config.targetScore) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Current item */}
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItemIndex}
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 max-w-sm w-full"
            >
              <p className="text-white/60 text-xs sm:text-sm text-center mb-2">Classifique:</p>
              <p className="text-white text-xl sm:text-2xl font-bold text-center">
                {currentItem.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategorySelect(category.name, index)}
              disabled={feedback !== null}
              className={`relative py-4 sm:py-6 px-4 rounded-xl sm:rounded-2xl font-bold text-white text-sm sm:text-lg shadow-lg border-2 transition-all bg-gradient-to-br ${getCategoryColor(category.color)} ${
                feedback?.categoryIndex === index
                  ? feedback.type === 'correct'
                    ? 'ring-4 ring-green-400'
                    : 'ring-4 ring-red-400'
                  : ''
              }`}
            >
              {category.name}
              
              {feedback?.categoryIndex === index && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {feedback.type === 'correct' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <X className="w-5 h-5 text-white" />
                  )}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
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
                {gameState === 'success' ? 'Excelente!' : 'Tente Novamente'}
              </h2>
              <p className="text-white text-lg sm:text-xl">Pontuação: {score}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
