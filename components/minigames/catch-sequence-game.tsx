'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Check, Clock, Target, Zap } from 'lucide-react'

interface CatchSequenceGameProps {
  config: MinigameConfig
  items: { content: string; order: number }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface FallingItem {
  id: string
  content: string
  order: number
  x: number
  y: number
  speed: number
  caught: boolean
}

export function CatchSequenceGame({ config, items, onComplete, onClose }: CatchSequenceGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([])
  const [nextExpected, setNextExpected] = useState(1)
  const [combo, setCombo] = useState(0)
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'wrong' | 'sequence'; x: number; y: number } | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastSpawnRef = useRef(0)

  const spawnItem = useCallback(() => {
    const randomItem = items[Math.floor(Math.random() * items.length)]
    const newItem: FallingItem = {
      id: `${Date.now()}-${Math.random()}`,
      content: randomItem.content,
      order: randomItem.order,
      x: 10 + Math.random() * 80,
      y: -10,
      speed: 0.3 + Math.random() * 0.3 + (config.difficulty || 1) * 0.1,
      caught: false
    }
    setFallingItems(prev => [...prev, newItem])
  }, [items, config.difficulty])

  const handleCatch = useCallback((item: FallingItem, e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing' || item.caught) return

    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top

    if (item.order === nextExpected) {
      // Acertou na sequência!
      const comboBonus = Math.min(combo, 5) * 5
      const points = 20 + comboBonus
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setNextExpected(prev => prev <= items.length ? prev + 1 : 1)
      setShowFeedback({ type: 'sequence', x, y })
      setFallingItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, caught: true } : i
      ))
    } else {
      // Errou a sequência
      setCombo(0)
      setShowFeedback({ type: 'wrong', x, y })
    }

    setTimeout(() => setShowFeedback(null), 500)
  }, [gameState, nextExpected, combo, items.length])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = (timestamp: number) => {
      // Spawn items
      if (timestamp - lastSpawnRef.current > 1500 - (config.difficulty || 1) * 200) {
        spawnItem()
        lastSpawnRef.current = timestamp
      }

      // Update positions
      setFallingItems(prev => {
        const updated = prev
          .map(item => ({
            ...item,
            y: item.caught ? item.y : item.y + item.speed
          }))
          .filter(item => item.y < 110 || item.caught)

        return updated
      })

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, spawnItem, config.difficulty])

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
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 flex flex-col z-50">
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
          <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Sequence indicator */}
      <div className="px-4 py-2 bg-black/20">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white/70 text-sm">Próximo na sequência:</span>
          <span className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-full text-white font-bold">
            {items.find(i => i.order === nextExpected)?.content || '?'}
          </span>
          {combo > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/30 px-2 py-1 rounded-full">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-bold text-sm">x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Game area */}
      <div 
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden"
      >
        <AnimatePresence>
          {fallingItems.map(item => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: item.caught ? 1.5 : 1, 
                opacity: item.caught ? 0 : 1,
                y: `${item.y}%`,
                x: 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: item.caught ? 0.3 : 0 }}
              onClick={(e) => handleCatch(item, e)}
              onTouchStart={(e) => handleCatch(item, e)}
              className={`absolute transform -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-white shadow-lg cursor-pointer transition-colors ${
                item.order === nextExpected
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-2 ring-green-300'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}
              style={{ left: `${item.x}%`, top: 0 }}
            >
              {item.content}
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
              className="fixed z-50 pointer-events-none"
              style={{ left: showFeedback.x - 30, top: showFeedback.y - 30 }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                showFeedback.type === 'sequence' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {showFeedback.type === 'sequence' ? (
                  <Check className="w-10 h-10 text-white" />
                ) : (
                  <X className="w-10 h-10 text-white" />
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
                {gameState === 'success' ? 'Parabéns!' : 'Tente Novamente'}
              </h2>
              <p className="text-white text-xl">Pontuação: {score}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
