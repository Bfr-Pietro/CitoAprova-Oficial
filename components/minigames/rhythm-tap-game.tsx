'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Clock, Target, Zap, Check, Star } from 'lucide-react'

interface RhythmTapGameProps {
  config: MinigameConfig
  questions: { question: string; answer: string }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface FallingNote {
  id: string
  lane: number
  y: number
  speed: number
  letter: string
  isHit: boolean
}

export function RhythmTapGame({ config, questions, onComplete, onClose }: RhythmTapGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [fallingNotes, setFallingNotes] = useState<FallingNote[]>([])
  const [collectedLetters, setCollectedLetters] = useState<string[]>([])
  const [combo, setCombo] = useState(0)
  const [showPerfect, setShowPerfect] = useState<number | null>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastSpawnRef = useRef(0)

  const lanes = [0, 1, 2, 3]
  const currentQuestion = questions[currentQuestionIndex % questions.length]
  const targetLetters = currentQuestion.answer.toUpperCase().split('')
  const nextNeededLetter = targetLetters[collectedLetters.length]

  const spawnNote = useCallback(() => {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃ'
    const lane = Math.floor(Math.random() * 4)
    const isCorrectChance = Math.random() < 0.35
    
    let letter: string
    if (isCorrectChance && nextNeededLetter) {
      letter = nextNeededLetter
    } else {
      const wrongLetters = allLetters.split('').filter(l => l !== nextNeededLetter)
      letter = wrongLetters[Math.floor(Math.random() * wrongLetters.length)]
    }

    const newNote: FallingNote = {
      id: `${Date.now()}-${Math.random()}`,
      lane,
      y: -10,
      speed: 0.5 + (config.difficulty || 1) * 0.15,
      letter,
      isHit: false
    }
    setFallingNotes(prev => [...prev, newNote])
  }, [nextNeededLetter, config.difficulty])

  const handleLaneTap = useCallback((lane: number) => {
    if (gameState !== 'playing') return

    // Encontrar nota no hit zone (entre 75% e 95%)
    const noteInHitZone = fallingNotes.find(
      note => note.lane === lane && !note.isHit && note.y >= 70 && note.y <= 95
    )

    if (noteInHitZone) {
      if (noteInHitZone.letter === nextNeededLetter) {
        // Perfect hit!
        const perfectBonus = noteInHitZone.y >= 80 && noteInHitZone.y <= 90 ? 10 : 0
        const comboBonus = Math.min(combo, 10) * 3
        const points = 15 + comboBonus + perfectBonus
        
        setScore(prev => prev + points)
        setCombo(prev => prev + 1)
        setCollectedLetters(prev => [...prev, noteInHitZone.letter])
        setShowPerfect(lane)
        setFallingNotes(prev => prev.map(n => 
          n.id === noteInHitZone.id ? { ...n, isHit: true } : n
        ))

        setTimeout(() => setShowPerfect(null), 300)

        // Verificar se completou a palavra
        if (collectedLetters.length + 1 >= targetLetters.length) {
          setScore(prev => prev + 40)
          setTimeout(() => {
            setCollectedLetters([])
            setCurrentQuestionIndex(prev => prev + 1)
          }, 500)
        }
      } else {
        // Wrong letter
        setCombo(0)
        setFallingNotes(prev => prev.map(n => 
          n.id === noteInHitZone.id ? { ...n, isHit: true } : n
        ))
      }
    }
  }, [gameState, fallingNotes, nextNeededLetter, combo, collectedLetters.length, targetLetters.length])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastSpawnRef.current > 600) {
        spawnNote()
        lastSpawnRef.current = timestamp
      }

      setFallingNotes(prev => 
        prev
          .map(note => ({ ...note, y: note.y + note.speed }))
          .filter(note => note.y < 110 || note.isHit)
      )

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameState, spawnNote])

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

  const laneColors = [
    'from-pink-500 to-rose-600',
    'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-violet-600'
  ]

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex flex-col z-50">
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

      {/* Question and progress */}
      <div className="px-4 py-2 bg-black/20">
        <p className="text-white/70 text-xs sm:text-sm text-center mb-2">
          {currentQuestion.question}
        </p>
        <div className="flex justify-center gap-1">
          {targetLetters.map((letter, index) => (
            <div
              key={index}
              className={`w-7 h-8 sm:w-8 sm:h-10 rounded-md flex items-center justify-center text-sm sm:text-lg font-bold ${
                index < collectedLetters.length
                  ? 'bg-green-500 text-white'
                  : index === collectedLetters.length
                  ? 'bg-yellow-500/30 text-yellow-400 animate-pulse'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {index < collectedLetters.length ? collectedLetters[index] : '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Game lanes */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Hit zone indicator */}
        <div className="absolute left-0 right-0 bottom-[5%] h-[25%] bg-gradient-to-t from-white/5 to-transparent pointer-events-none z-10" />
        
        {lanes.map(lane => (
          <button
            key={lane}
            onClick={() => handleLaneTap(lane)}
            className="flex-1 relative border-r border-white/10 last:border-r-0"
          >
            {/* Lane background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${laneColors[lane]} opacity-5`} />
            
            {/* Notes in this lane */}
            <AnimatePresence>
              {fallingNotes
                .filter(note => note.lane === lane && !note.isHit)
                .map(note => (
                  <motion.div
                    key={note.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg bg-gradient-to-br ${laneColors[lane]} text-white ${
                      note.letter === nextNeededLetter ? 'ring-2 ring-yellow-400' : ''
                    }`}
                    style={{ top: `${note.y}%` }}
                  >
                    {note.letter}
                  </motion.div>
                ))}
            </AnimatePresence>

            {/* Perfect indicator */}
            <AnimatePresence>
              {showPerfect === lane && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-[15%] flex items-center gap-1"
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">PERFEITO!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hit zone at bottom */}
            <div className={`absolute bottom-[5%] left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed ${
              showPerfect === lane ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/30'
            }`} />
          </button>
        ))}
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
