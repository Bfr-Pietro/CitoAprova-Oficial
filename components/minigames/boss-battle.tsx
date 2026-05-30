'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Heart, Skull, Zap, Shield, Swords } from 'lucide-react'

interface Attack {
  question: string
  options: string[]
  correctIndex: number
  damage: number
}

interface BossBattleProps {
  config: MinigameConfig
  bossName: string
  attacks: Attack[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function BossBattle({ config, bossName, attacks, onComplete, onClose }: BossBattleProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [bossHealth, setBossHealth] = useState(100)
  const [playerLives, setPlayerLives] = useState(3)
  const [currentAttackIndex, setCurrentAttackIndex] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'attack' | 'result'>('idle')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [attackTimer, setAttackTimer] = useState(8)
  const [bossAnimation, setBossAnimation] = useState<'idle' | 'attack' | 'hurt' | 'victory'>('idle')
  const [playerAnimation, setPlayerAnimation] = useState<'idle' | 'attack' | 'hurt' | 'victory'>('idle')
  const [showDamage, setShowDamage] = useState<{ type: 'player' | 'boss'; amount: number } | null>(null)
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false)

  // Ref para controlar se o timeout já foi processado
  const timeoutProcessedRef = useRef(false)

  const currentAttack = attacks[currentAttackIndex % attacks.length]

  // Iniciar batalha
  useEffect(() => {
    // Reset refs ao iniciar novo jogo
    timeoutProcessedRef.current = false
    setHasAnsweredCurrent(false)
    startGame()
    setPhase('attack')
  }, [startGame])

  // Timer do ataque
  useEffect(() => {
    if (phase !== 'attack' || !state.isActive) return

    // Reset timeout flag quando uma nova rodada começa
    timeoutProcessedRef.current = false

    const timer = setInterval(() => {
      setAttackTimer(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, state.isActive, currentAttackIndex])

  // Quando o tempo do ataque acaba
  useEffect(() => {
    if (attackTimer === 0 && phase === 'attack' && state.isActive && !hasAnsweredCurrent && !timeoutProcessedRef.current) {
      timeoutProcessedRef.current = true
      handleAnswerInternal(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attackTimer, phase, state.isActive, hasAnsweredCurrent])

  const handleAnswerInternal = useCallback((index: number) => {
    if (phase !== 'attack' || !state.isActive || hasAnsweredCurrent) return

    setHasAnsweredCurrent(true)
    setSelectedAnswer(index)
    setPhase('result')

    const isCorrect = index === currentAttack.correctIndex
    const damage = currentAttack.damage * (1 + state.combo * 0.1)

    if (isCorrect) {
      // Jogador acerta - boss leva dano
      setBossAnimation('hurt')
      setPlayerAnimation('attack')
      setShowDamage({ type: 'boss', amount: Math.floor(damage) })
      correctAnswer(20)

      // Atualizar boss health e verificar vitoria
      setBossHealth(prev => {
        const newHealth = Math.max(0, prev - damage)
        
        // Verificar vitoria apos 1.5s
        setTimeout(() => {
          if (newHealth <= 0) {
            setBossAnimation('hurt')
            setPlayerAnimation('victory')
            endGame(true)
            return
          }
          
          // Proxima rodada
          setBossAnimation('idle')
          setPlayerAnimation('idle')
          setShowDamage(null)
          timeoutProcessedRef.current = false
          setHasAnsweredCurrent(false)
          setCurrentAttackIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setPhase('attack')
          setAttackTimer(8)
        }, 1500)
        
        return newHealth
      })

      setTimeout(() => {
        setBossAnimation('idle')
        setPlayerAnimation('idle')
        setShowDamage(null)
      }, 800)
    } else {
      // Jogador erra - jogador leva dano
      setBossAnimation('attack')
      setPlayerAnimation('hurt')
      setShowDamage({ type: 'player', amount: 1 })
      wrongAnswer(10)

      // Atualizar vidas e verificar derrota
      setPlayerLives(prev => {
        const newLives = prev - 1
        
        // Verificar derrota apos 1.5s
        setTimeout(() => {
          if (newLives <= 0) {
            setBossAnimation('victory')
            setPlayerAnimation('hurt')
            endGame(false)
            return
          }
          
          // Proxima rodada
          setBossAnimation('idle')
          setPlayerAnimation('idle')
          setShowDamage(null)
          timeoutProcessedRef.current = false
          setHasAnsweredCurrent(false)
          setCurrentAttackIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setPhase('attack')
          setAttackTimer(8)
        }, 1500)
        
        return newLives
      })

      setTimeout(() => {
        setBossAnimation('idle')
        setPlayerAnimation('idle')
        setShowDamage(null)
      }, 800)
    }
  }, [phase, state.isActive, state.combo, currentAttack, correctAnswer, wrongAnswer, endGame, hasAnsweredCurrent])

  const handleAnswer = useCallback((index: number) => {
    handleAnswerInternal(index)
  }, [handleAnswerInternal])

  // Removido useEffect duplicado - a verificação de vitória/derrota já é feita no handleAnswerInternal

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <GameHeader
          title={config.title}
          score={state.score}
          targetScore={config.targetScore}
          timeRemaining={state.timeRemaining}
          timeLimit={config.timeLimit}
          combo={state.combo}
          lives={playerLives}
          onClose={onClose}
        />

        {/* Arena de batalha */}
        <div className="relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl border-2 border-slate-700 p-4 mb-4 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)]" />
          
          <div className="flex justify-between items-start">
            {/* Jogador */}
            <div className="text-center">
              <div className={cn(
                "w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2 transition-all",
                playerAnimation === 'attack' && "scale-110 translate-x-4",
                playerAnimation === 'hurt' && "animate-shake scale-90",
                playerAnimation === 'victory' && "animate-bounce"
              )}>
                <Shield className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm font-bold text-white">Detetive</p>
              <div className="flex gap-1 justify-center mt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "w-5 h-5 transition-all",
                      i < playerLives ? "text-red-500 fill-red-500" : "text-slate-600"
                    )}
                  />
                ))}
              </div>
              {showDamage?.type === 'player' && (
                <div className="absolute animate-score-pop text-red-500 font-bold text-xl">
                  -{showDamage.amount}
                </div>
              )}
            </div>

            {/* VS */}
            <div className="flex items-center">
              <Swords className="w-8 h-8 text-slate-500" />
            </div>

            {/* Boss */}
            <div className="text-center">
              <div className={cn(
                "w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center mb-2 transition-all",
                bossAnimation === 'attack' && "scale-110 -translate-x-4",
                bossAnimation === 'hurt' && "animate-shake scale-90",
                bossAnimation === 'victory' && "animate-bounce"
              )}>
                <Skull className="w-12 h-12 text-white" />
              </div>
              <p className="text-sm font-bold text-red-400">{bossName}</p>
              {/* Barra de vida do boss */}
              <div className="w-24 h-3 bg-slate-700 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                  style={{ width: `${bossHealth}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{Math.floor(bossHealth)}%</p>
              {showDamage?.type === 'boss' && (
                <div className="absolute animate-score-pop text-primary font-bold text-xl">
                  -{showDamage.amount}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timer do ataque */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Tempo para responder</span>
            <span className={cn(
              "font-mono font-bold",
              attackTimer <= 3 ? "text-red-500 animate-timer-pulse" : "text-white"
            )}>
              {attackTimer}s
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                attackTimer <= 3 ? "bg-red-500" : "bg-amber-500"
              )}
              style={{ width: `${(attackTimer / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Ataque/Pergunta */}
        <div className="glass rounded-2xl p-4 mb-4 border border-red-500/30 bg-slate-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">ATAQUE DO FRAGMENTO!</span>
          </div>
          <p className="text-lg font-bold text-white">{currentAttack.question}</p>
        </div>

        {/* Opcoes de defesa */}
        <div className="space-y-2">
          {currentAttack.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === currentAttack.correctIndex
            const showCorrect = phase === 'result' && isCorrect
            const showWrong = phase === 'result' && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={phase !== 'attack'}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                  "flex items-center gap-3",
                  showCorrect
                    ? "border-primary bg-primary/20 text-primary"
                    : showWrong
                      ? "border-red-500 bg-red-500/20 text-red-400 animate-shake"
                      : "border-slate-600 bg-slate-800/50 text-white hover:border-amber-500 hover:bg-slate-700/50"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                  showCorrect ? "bg-primary text-white" :
                  showWrong ? "bg-red-500 text-white" :
                  "bg-slate-700 text-white"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
