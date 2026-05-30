'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Clock, Target, Zap, Check } from 'lucide-react'

interface WhackAMoleGameProps {
  config: MinigameConfig
  items: { content: string; isCorrect: boolean }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface Mole {
  id: string
  content: string
  isCorrect: boolean
  position: number
  isVisible: boolean
}

export function WhackAMoleGame({ config, items, onComplete, onClose }: WhackAMoleGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [moles, setMoles] = useState<Mole[]>([])
  const [combo, setCombo] = useState(0)
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'wrong'; position: number } | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8] // 3x3 grid

  const spawnMole = useCallback(() => {
    const availablePositions = holes.filter(
      pos => !moles.some(m => m.position === pos && m.isVisible)
    )
    
    if (availablePositions.length === 0) return

    const position = availablePositions[Math.floor(Math.random() * availablePositions.length)]
    const item = items[Math.floor(Math.random() * items.length)]

    const newMole: Mole = {
      id: `${Date.now()}-${Math.random()}`,
      content: item.content,
      isCorrect: item.isCorrect,
      position,
      isVisible: true
    }

    setMoles(prev => [...prev, newMole])

    // Esconder após um tempo
    setTimeout(() => {
      setMoles(prev => prev.filter(m => m.id !== newMole.id))
    }, 2000 - (config.difficulty || 1) * 300)
  }, [items, moles, config.difficulty, holes])

  const handleWhack = useCallback((mole: Mole) => {
    if (gameState !== 'playing' || !mole.isVisible) return

    if (mole.isCorrect) {
      const comboBonus = Math.min(combo, 10) * 3
      const points = 15 + comboBonus
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setShowFeedback({ type: 'correct', position: mole.position })
    } else {
      setCombo(0)
      setShowFeedback({ type: 'wrong', position: mole.position })
    }

    setMoles(prev => prev.filter(m => m.id !== mole.id))
    setTimeout(() => setShowFeedback(null), 300)
  }, [gameState, combo])

  // Spawn moles periodically
  useEffect(() => {
    if (gameState !== 'playing') return

    intervalRef.current = setInterval(() => {
      spawnMole()
    }, 1200 - (config.difficulty || 1) * 200)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [gameState, spawnMole, config.difficulty])

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

  const getMoleAtPosition = (pos: number) => moles.find(m => m.position === pos && m.isVisible)

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-800 via-orange-900 to-red-900 flex flex-col z-50">
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

      {/* Instructions */}
      <div className="px-4 py-2 bg-black/20">
        <p className="text-white/80 text-xs sm:text-sm text-center">
          🎯 Toque apenas nos termos <span className="text-green-400 font-bold">corretos</span> sobre biologia celular!
        </p>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm w-full">
          {holes.map(position => {
            const mole = getMoleAtPosition(position)
            
            return (
              <div
                key={position}
                className="aspect-square relative"
              >
                {/* Buraco */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-950 to-amber-900 border-4 border-amber-800 shadow-inner" />
                
                {/* Mole */}
                <AnimatePresence>
                  {mole && (
                    <motion.button
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '100%', opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => handleWhack(mole)}
                      className={`absolute inset-1 rounded-xl flex items-center justify-center p-2 font-bold text-white text-xs sm:text-sm shadow-lg ${
                        mole.isCorrect
                          ? 'bg-gradient-to-br from-green-500 to-emerald-700'
                          : 'bg-gradient-to-br from-red-500 to-rose-700'
                      }`}
                    >
                      <span className="text-center line-clamp-2">{mole.content}</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Feedback */}
                <AnimatePresence>
                  {showFeedback?.position === position && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute inset-0 rounded-full flex items-center justify-center ${
                        showFeedback.type === 'correct' ? 'bg-green-500/50' : 'bg-red-500/50'
                      }`}
                    >
                      {showFeedback.type === 'correct' ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <X className="w-8 h-8 text-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
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
