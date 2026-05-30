'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Volume2, VolumeX } from 'lucide-react'

interface SimonSaysGameProps {
  config: MinigameConfig
  colors?: Array<{ color: string; label: string }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

const DEFAULT_COLORS = [
  { color: 'from-red-500 to-red-600', label: 'Vermelho' },
  { color: 'from-blue-500 to-blue-600', label: 'Azul' },
  { color: 'from-green-500 to-green-600', label: 'Verde' },
  { color: 'from-yellow-500 to-yellow-600', label: 'Amarelo' }
]

type GamePhase = 'watching' | 'playing' | 'success' | 'fail' | 'complete'

export function SimonSaysGame({ config, colors = DEFAULT_COLORS, onComplete, onClose }: SimonSaysGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [phase, setPhase] = useState<GamePhase>('watching')
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [level, setLevel] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  const gameEndedRef = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const maxLevel = 8 + config.difficulty * 2 // 10-14 níveis baseado na dificuldade

  // Criar contexto de áudio
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  // Tocar som para cada cor
  const playSound = useCallback((colorIndex: number) => {
    if (!soundEnabled || !audioContextRef.current) return

    const frequencies = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
    const context = audioContextRef.current
    
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    
    oscillator.frequency.value = frequencies[colorIndex]
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3)
    
    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + 0.3)
  }, [soundEnabled])

  // Iniciar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setSequence([])
    setPlayerSequence([])
    setLevel(1)
    setPhase('watching')
    startGame()
  }, [startGame])

  // Adicionar nova cor à sequência
  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * colors.length)
    setSequence(prev => [...prev, newColor])
  }, [colors.length])

  // Iniciar novo round
  useEffect(() => {
    if (phase === 'watching' && state.isActive) {
      // Aguardar um pouco e adicionar nova cor
      const timer = setTimeout(() => {
        addToSequence()
      }, level === 1 ? 1000 : 500)
      return () => clearTimeout(timer)
    }
  }, [phase, level, state.isActive, addToSequence])

  // Mostrar sequência para o jogador
  useEffect(() => {
    if (phase !== 'watching' || sequence.length === 0) return

    let i = 0
    const showSequence = () => {
      if (i < sequence.length) {
        setActiveColor(sequence[i])
        playSound(sequence[i])
        
        setTimeout(() => {
          setActiveColor(null)
          i++
          setTimeout(showSequence, 300)
        }, 500)
      } else {
        setPhase('playing')
        setPlayerSequence([])
      }
    }

    const timer = setTimeout(showSequence, 500)
    return () => clearTimeout(timer)
  }, [sequence, phase, playSound])

  // Manipular clique do jogador
  const handleColorClick = useCallback((colorIndex: number) => {
    if (phase !== 'playing' || !state.isActive) return

    setActiveColor(colorIndex)
    playSound(colorIndex)
    
    setTimeout(() => setActiveColor(null), 200)

    const newPlayerSequence = [...playerSequence, colorIndex]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1

    // Verificar se está correto
    if (sequence[currentIndex] !== colorIndex) {
      // Errou!
      setPhase('fail')
      wrongAnswer(20)
      
      setTimeout(() => {
        if (gameEndedRef.current) return
        gameEndedRef.current = true
        endGame()
      }, 1500)
      return
    }

    // Completou a sequência atual?
    if (newPlayerSequence.length === sequence.length) {
      setPhase('success')
      correctAnswer(level * 10)

      setTimeout(() => {
        if (level >= maxLevel) {
          // Completou todos os níveis!
          if (gameEndedRef.current) return
          gameEndedRef.current = true
          setPhase('complete')
          endGame(true)
        } else {
          setLevel(prev => prev + 1)
          setPhase('watching')
        }
      }, 1000)
    }
  }, [phase, state.isActive, playerSequence, sequence, level, maxLevel, playSound, correctAnswer, wrongAnswer, endGame])

  const getPhaseMessage = () => {
    switch (phase) {
      case 'watching':
        return 'Observe a sequência...'
      case 'playing':
        return 'Sua vez! Repita a sequência'
      case 'success':
        return 'Correto! Próximo nível...'
      case 'fail':
        return 'Ops! Sequência errada!'
      case 'complete':
        return 'Parabéns! Memória impecável!'
      default:
        return ''
    }
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

        {/* Nível e progresso */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Nível</span>
            <span className="text-2xl font-bold text-primary">{level}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Mensagem de fase */}
        <div className={cn(
          "text-center py-3 rounded-xl mb-6 font-medium",
          phase === 'watching' && "bg-accent/20 text-accent-foreground",
          phase === 'playing' && "bg-primary/20 text-primary animate-pulse",
          phase === 'success' && "bg-green-500/20 text-green-600",
          phase === 'fail' && "bg-destructive/20 text-destructive",
          phase === 'complete' && "bg-primary/30 text-primary"
        )}>
          {getPhaseMessage()}
        </div>

        {/* Grid de cores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {colors.map((colorItem, index) => (
            <button
              key={index}
              onClick={() => handleColorClick(index)}
              disabled={phase !== 'playing'}
              className={cn(
                "aspect-square rounded-2xl transition-all duration-200",
                "bg-gradient-to-br shadow-lg",
                "flex items-center justify-center",
                colorItem.color,
                activeColor === index
                  ? "scale-95 brightness-150 ring-4 ring-white/50"
                  : "hover:scale-[1.02]",
                phase !== 'playing' && "opacity-70 cursor-not-allowed"
              )}
            >
              <span className="sr-only">{colorItem.label}</span>
            </button>
          ))}
        </div>

        {/* Indicador de sequência */}
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Sequência atual:</span>
          <div className="flex gap-1">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  i < playerSequence.length
                    ? "bg-primary"
                    : i === playerSequence.length && phase === 'playing'
                      ? "bg-accent animate-pulse"
                      : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-primary">{sequence.length}</div>
            <div className="text-xs text-muted-foreground">Tamanho da sequência</div>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-accent">{maxLevel - level + 1}</div>
            <div className="text-xs text-muted-foreground">Níveis restantes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
