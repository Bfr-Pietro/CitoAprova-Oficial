'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Crosshair, Target } from 'lucide-react'

interface MovingTarget {
  id: string
  content: string
  isCorrect: boolean
  x: number
  y: number
  vx: number
  vy: number
  size: number
  isHit: boolean
  hitResult?: 'correct' | 'wrong'
}

interface TargetShooterGameProps {
  config: MinigameConfig
  targets: Array<{ content: string; isCorrect: boolean }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function TargetShooterGame({ config, targets, onComplete, onClose }: TargetShooterGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer } = useMinigame({
    config,
    onComplete
  })

  const [movingTargets, setMovingTargets] = useState<MovingTarget[]>([])
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 })
  const [shotsFired, setShotsFired] = useState(0)
  const [hits, setHits] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const hitTargetsRef = useRef<Set<string>>(new Set())

  // Spawn de alvos
  useEffect(() => {
    if (!state.isActive) return

    const spawnTarget = () => {
      const randomTarget = targets[Math.floor(Math.random() * targets.length)]
      const speed = 0.5 + Math.random() * 1 + config.difficulty * 0.3
      const angle = Math.random() * Math.PI * 2
      
      const newTarget: MovingTarget = {
        id: `${Date.now()}-${Math.random()}`,
        content: randomTarget.content,
        isCorrect: randomTarget.isCorrect,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 50 + Math.random() * 30,
        isHit: false
      }
      setMovingTargets(prev => [...prev.slice(-8), newTarget])
    }

    // Spawn inicial
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnTarget(), i * 400)
    }

    const spawnInterval = setInterval(spawnTarget, Math.max(1000, 2500 - config.difficulty * 500))

    return () => clearInterval(spawnInterval)
  }, [state.isActive, targets, config.difficulty])

  // Animação de movimento dos alvos
  useEffect(() => {
    if (!state.isActive) return

    const animate = () => {
      setMovingTargets(prev => prev.map(target => {
        if (target.isHit) return target

        let newX = target.x + target.vx
        let newY = target.y + target.vy
        let newVx = target.vx
        let newVy = target.vy

        // Rebater nas bordas
        if (newX <= 5 || newX >= 90) {
          newVx = -newVx
          newX = Math.max(5, Math.min(90, newX))
        }
        if (newY <= 5 || newY >= 85) {
          newVy = -newVy
          newY = Math.max(5, Math.min(85, newY))
        }

        return {
          ...target,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        }
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [state.isActive])

  // Mover mira com mouse/touch
  const handlePointerMove = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    let clientX: number, clientY: number
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setCrosshairPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }, [])

  // Atirar
  const handleShoot = useCallback(() => {
    if (!state.isActive) return

    setShotsFired(prev => prev + 1)

    // Verificar se acertou algum alvo
    const hitTarget = movingTargets.find(target => {
      if (target.isHit || hitTargetsRef.current.has(target.id)) return false
      
      const targetCenterX = target.x
      const targetCenterY = target.y
      const hitRadius = target.size / 2 / 3.5 // Raio de hit proporcional ao tamanho
      
      const distance = Math.sqrt(
        Math.pow(crosshairPos.x - targetCenterX, 2) +
        Math.pow(crosshairPos.y - targetCenterY, 2)
      )
      
      return distance < hitRadius
    })

    if (hitTarget) {
      hitTargetsRef.current.add(hitTarget.id)
      
      setMovingTargets(prev => prev.map(t =>
        t.id === hitTarget.id
          ? { ...t, isHit: true, hitResult: hitTarget.isCorrect ? 'correct' : 'wrong' }
          : t
      ))

      if (hitTarget.isCorrect) {
        correctAnswer(20)
        setHits(prev => prev + 1)
      } else {
        wrongAnswer(15)
      }

      // Remover alvo após animação
      setTimeout(() => {
        setMovingTargets(prev => prev.filter(t => t.id !== hitTarget.id))
      }, 500)
    }
  }, [state.isActive, movingTargets, crosshairPos, correctAnswer, wrongAnswer])

  // Iniciar jogo
  useEffect(() => {
    hitTargetsRef.current.clear()
    setShotsFired(0)
    setHits(0)
    startGame()
  }, [startGame])

  const accuracy = shotsFired > 0 ? Math.round((hits / shotsFired) * 100) : 0

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

        {/* Estatísticas */}
        <div className="flex justify-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span>Acertos: {hits}</span>
          </div>
          <div className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-accent" />
            <span>Precisão: {accuracy}%</span>
          </div>
        </div>

        {/* Área de jogo */}
        <div
          ref={containerRef}
          onClick={handleShoot}
          onPointerMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-600 h-[400px] overflow-hidden cursor-none touch-none select-none"
        >
          {/* Grid de fundo */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Alvos */}
          {movingTargets.map(target => (
            <div
              key={target.id}
              className={cn(
                "absolute rounded-full transition-all duration-200",
                "flex items-center justify-center text-center",
                "transform -translate-x-1/2 -translate-y-1/2",
                target.isHit
                  ? target.hitResult === 'correct'
                    ? "scale-150 opacity-0 bg-primary/50"
                    : "scale-50 opacity-0 bg-destructive/50 animate-shake"
                  : target.isCorrect
                    ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 border-2 border-white/20"
                    : "bg-gradient-to-br from-destructive to-red-700 shadow-lg shadow-destructive/30 border-2 border-white/20"
              )}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
                fontSize: `${Math.max(9, target.size / 5)}px`
              }}
            >
              {!target.isHit && (
                <span className="font-medium text-white px-1 leading-tight">
                  {target.content}
                </span>
              )}
            </div>
          ))}

          {/* Mira */}
          <div
            className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${crosshairPos.x}%`,
              top: `${crosshairPos.y}%`
            }}
          >
            <div className="relative w-12 h-12">
              {/* Círculo externo */}
              <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-pulse" />
              {/* Linhas da mira */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 transform -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-red-500 transform -translate-x-1/2" />
              {/* Ponto central */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent" />
            <span className="text-muted-foreground">Acerte!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-destructive to-red-700" />
            <span className="text-muted-foreground">Evite!</span>
          </div>
        </div>

        {/* Instruções */}
        <p className="text-center text-xs text-muted-foreground mt-3">
          Mova a mira e clique para atirar nos alvos corretos!
        </p>
      </div>
    </div>
  )
}
