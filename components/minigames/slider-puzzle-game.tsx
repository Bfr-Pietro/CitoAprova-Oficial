'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MinigameConfig } from '@/lib/minigame-types'
import { X, Clock, Target, RotateCcw, Check } from 'lucide-react'

interface SliderPuzzleGameProps {
  config: MinigameConfig
  concepts: { term: string; definition: string }[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface PuzzlePiece {
  id: number
  currentPos: number
  correctPos: number
  content: string
}

export function SliderPuzzleGame({ config, concepts, onComplete, onClose }: SliderPuzzleGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing')
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0)
  const [moves, setMoves] = useState(0)
  const [puzzlesSolved, setPuzzlesSolved] = useState(0)

  const currentConcept = concepts[currentConceptIndex % concepts.length]

  // Inicializar puzzle
  const initPuzzle = useCallback(() => {
    const letters = currentConcept.term.toUpperCase().split('')
    const initialPieces: PuzzlePiece[] = letters.map((letter, index) => ({
      id: index,
      currentPos: index,
      correctPos: index,
      content: letter
    }))
    
    // Embaralhar
    const shuffled = [...initialPieces]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempPos = shuffled[i].currentPos
      shuffled[i].currentPos = shuffled[j].currentPos
      shuffled[j].currentPos = tempPos
    }
    
    setPieces(shuffled)
    setMoves(0)
  }, [currentConcept])

  useEffect(() => {
    initPuzzle()
  }, [initPuzzle])

  const swapPieces = useCallback((index1: number, index2: number) => {
    setPieces(prev => {
      const newPieces = [...prev]
      const piece1 = newPieces.find(p => p.currentPos === index1)
      const piece2 = newPieces.find(p => p.currentPos === index2)
      
      if (piece1 && piece2) {
        piece1.currentPos = index2
        piece2.currentPos = index1
      }
      
      return newPieces
    })
    setMoves(prev => prev + 1)
  }, [])

  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)

  const handlePieceClick = useCallback((position: number) => {
    if (gameState !== 'playing') return

    if (selectedPiece === null) {
      setSelectedPiece(position)
    } else {
      if (selectedPiece !== position) {
        swapPieces(selectedPiece, position)
      }
      setSelectedPiece(null)
    }
  }, [gameState, selectedPiece, swapPieces])

  // Verificar se o puzzle está resolvido
  useEffect(() => {
    if (pieces.length === 0) return
    
    const isSolved = pieces.every(p => p.currentPos === p.correctPos)
    
    if (isSolved && gameState === 'playing') {
      const moveBonus = Math.max(0, 50 - moves * 2)
      const points = 30 + moveBonus
      setScore(prev => prev + points)
      setPuzzlesSolved(prev => prev + 1)
      
      setTimeout(() => {
        setCurrentConceptIndex(prev => prev + 1)
      }, 800)
    }
  }, [pieces, gameState, moves])

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

  const sortedPieces = [...pieces].sort((a, b) => a.currentPos - b.currentPos)

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-teal-900 via-cyan-900 to-blue-900 flex flex-col z-50">
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
          <div className="flex items-center gap-1 sm:gap-2 bg-blue-500/20 px-2 sm:px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-blue-400 font-bold text-sm sm:text-base">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 bg-black/20 flex justify-center gap-4">
        <div className="text-white/70 text-xs sm:text-sm">
          Movimentos: <span className="text-cyan-400 font-bold">{moves}</span>
        </div>
        <div className="text-white/70 text-xs sm:text-sm">
          Resolvidos: <span className="text-green-400 font-bold">{puzzlesSolved}</span>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Hint */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-sm w-full">
          <p className="text-white/60 text-xs sm:text-sm text-center mb-1">Dica:</p>
          <p className="text-cyan-300 text-sm sm:text-base text-center font-medium">
            {currentConcept.definition}
          </p>
        </div>

        {/* Puzzle pieces */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {sortedPieces.map((piece) => (
            <motion.button
              key={piece.id}
              layout
              layoutId={`piece-${piece.id}`}
              onClick={() => handlePieceClick(piece.currentPos)}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg transition-all ${
                selectedPiece === piece.currentPos
                  ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-500 to-amber-600 scale-110'
                  : piece.currentPos === piece.correctPos
                  ? 'bg-gradient-to-br from-green-500 to-emerald-700'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-700'
              } text-white`}
            >
              {piece.content}
            </motion.button>
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={initPuzzle}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white/70 hover:bg-white/20 transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar Puzzle
        </button>

        {/* Instructions */}
        <p className="mt-4 text-white/50 text-xs sm:text-sm text-center">
          Toque em duas peças para trocar suas posições
        </p>
      </div>

      {/* Solved overlay */}
      <AnimatePresence>
        {pieces.length > 0 && pieces.every(p => p.currentPos === p.correctPos) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-green-500 rounded-full p-4"
            >
              <Check className="w-12 h-12 text-white" />
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
              <p className="text-white/70 text-sm mt-2">
                Puzzles resolvidos: {puzzlesSolved}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
