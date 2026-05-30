'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Zap, Timer, AlertCircle } from 'lucide-react'

interface ReactionGameProps {
  config: MinigameConfig
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

type GamePhase = 'waiting' | 'ready' | 'go' | 'clicked' | 'too-early'

export function ReactionGame({ config, onComplete, onClose }: ReactionGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [phase, setPhase] = useState<GamePhase>('waiting')
  const [roundsCompleted, setRoundsCompleted] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [averageTime, setAverageTime] = useState<number>(0)
  const [allTimes, setAllTimes] = useState<number[]>([])
  
  const goTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const totalRounds = 5 + config.difficulty // 6-8 rounds baseado na dificuldade
  const gameEndedRef = useRef(false)

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setRoundsCompleted(0)
    setReactionTime(null)
    setBestTime(null)
    setAverageTime(0)
    setAllTimes([])
    setPhase('waiting')
    startGame()
  }, [startGame])

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startRound = useCallback(() => {
    if (!state.isActive) return
    
    setPhase('ready')
    setReactionTime(null)
    
    // Tempo aleatório entre 1.5s e 4s antes de mudar para "GO"
    const delay = 1500 + Math.random() * 2500
    
    timeoutRef.current = setTimeout(() => {
      setPhase('go')
      goTimeRef.current = performance.now()
    }, delay)
  }, [state.isActive])

  const handleClick = useCallback(() => {
    if (!state.isActive) return

    if (phase === 'waiting') {
      startRound()
      return
    }

    if (phase === 'ready') {
      // Clicou muito cedo!
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setPhase('too-early')
      wrongAnswer(15)
      
      setTimeout(() => {
        if (roundsCompleted + 1 >= totalRounds) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame()
          }
        } else {
          setRoundsCompleted(prev => prev + 1)
          setPhase('waiting')
        }
      }, 1500)
      return
    }

    if (phase === 'go') {
      const reaction = Math.round(performance.now() - goTimeRef.current)
      setReactionTime(reaction)
      setPhase('clicked')

      // Calcular pontos baseado no tempo de reação
      // Menos de 200ms = excelente, menos de 350ms = bom, menos de 500ms = ok
      let points = 10
      if (reaction < 200) {
        points = 40
      } else if (reaction < 300) {
        points = 30
      } else if (reaction < 400) {
        points = 20
      } else if (reaction < 500) {
        points = 15
      }

      correctAnswer(points)
      
      // Atualizar estatísticas
      const newTimes = [...allTimes, reaction]
      setAllTimes(newTimes)
      setAverageTime(Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length))
      
      if (bestTime === null || reaction < bestTime) {
        setBestTime(reaction)
      }

      setTimeout(() => {
        if (roundsCompleted + 1 >= totalRounds) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true
            endGame()
          }
        } else {
          setRoundsCompleted(prev => prev + 1)
          setPhase('waiting')
        }
      }, 1500)
    }
  }, [phase, state.isActive, startRound, correctAnswer, wrongAnswer, allTimes, bestTime, roundsCompleted, totalRounds, endGame])

  const getBackgroundColor = () => {
    switch (phase) {
      case 'waiting':
        return 'from-slate-600 to-slate-800'
      case 'ready':
        return 'from-amber-500 to-orange-600'
      case 'go':
        return 'from-emerald-500 to-green-600'
      case 'clicked':
        return 'from-primary to-accent'
      case 'too-early':
        return 'from-destructive to-red-700'
      default:
        return 'from-slate-600 to-slate-800'
    }
  }

  const getMessage = () => {
    switch (phase) {
      case 'waiting':
        return 'Toque para começar'
      case 'ready':
        return 'Aguarde...'
      case 'go':
        return 'CLIQUE AGORA!'
      case 'clicked':
        return `${reactionTime}ms`
      case 'too-early':
        return 'Muito cedo!'
      default:
        return ''
    }
  }

  const getReactionFeedback = () => {
    if (reactionTime === null) return ''
    if (reactionTime < 200) return 'Incrível! Reflexos de ninja!'
    if (reactionTime < 300) return 'Excelente! Muito rápido!'
    if (reactionTime < 400) return 'Muito bom!'
    if (reactionTime < 500) return 'Bom!'
    return 'Continue praticando!'
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

        <p className="text-center text-muted-foreground mb-4 text-sm">
          {config.description}
        </p>

        {/* Progresso das rodadas */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            Rodada {Math.min(roundsCompleted + 1, totalRounds)} de {totalRounds}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalRounds }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  i < roundsCompleted ? "bg-primary" :
                  i === roundsCompleted ? "bg-accent animate-pulse" :
                  "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Área de reação */}
        <button
          onClick={handleClick}
          className={cn(
            "w-full h-64 rounded-2xl transition-all duration-200",
            "bg-gradient-to-br shadow-xl",
            "flex flex-col items-center justify-center gap-4",
            "active:scale-[0.98]",
            getBackgroundColor()
          )}
        >
          {phase === 'waiting' && (
            <Timer className="h-16 w-16 text-white/80" />
          )}
          {phase === 'ready' && (
            <AlertCircle className="h-16 w-16 text-white animate-pulse" />
          )}
          {phase === 'go' && (
            <Zap className="h-16 w-16 text-white animate-bounce" />
          )}
          {phase === 'clicked' && (
            <Zap className="h-16 w-16 text-white" />
          )}
          {phase === 'too-early' && (
            <AlertCircle className="h-16 w-16 text-white" />
          )}
          
          <span className={cn(
            "text-3xl font-bold text-white",
            phase === 'go' && "animate-pulse text-4xl"
          )}>
            {getMessage()}
          </span>

          {phase === 'clicked' && (
            <span className="text-lg text-white/80 animate-slide-up">
              {getReactionFeedback()}
            </span>
          )}
        </button>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {bestTime !== null ? `${bestTime}ms` : '-'}
            </div>
            <div className="text-sm text-muted-foreground">Melhor tempo</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {averageTime > 0 ? `${averageTime}ms` : '-'}
            </div>
            <div className="text-sm text-muted-foreground">Tempo médio</div>
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Aguarde a tela ficar <span className="text-emerald-500 font-semibold">VERDE</span> e clique o mais rápido possível!</p>
          <p className="mt-1 text-xs">Clicar antes da hora perde pontos.</p>
        </div>
      </div>
    </div>
  )
}
