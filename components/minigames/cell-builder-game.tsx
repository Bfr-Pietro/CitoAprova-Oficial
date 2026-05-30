'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, RotateCcw, Lightbulb, Move } from 'lucide-react'

interface CellBuilderGameProps {
  config: MinigameConfig
  cellType: 'animal' | 'vegetal' | 'procarionte'
  organelles: Array<{
    id: string
    name: string
    description: string
    correctZone: string
    image?: string
  }>
  dropZones: Array<{
    id: string
    label: string
    description: string
    x: number
    y: number
    width: number
    height: number
  }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

interface PlacedOrganelle {
  id: string
  zoneId: string
  isCorrect: boolean
}

export function CellBuilderGame({ config, cellType, organelles, dropZones, onComplete, onClose }: CellBuilderGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [availableOrganelles, setAvailableOrganelles] = useState<typeof organelles>([])
  const [placedOrganelles, setPlacedOrganelles] = useState<PlacedOrganelle[]>([])
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintOrganelle, setHintOrganelle] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ zoneId: string; type: 'correct' | 'wrong' } | null>(null)
  const gameEndedRef = useRef(false)

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    // Embaralhar organelas
    const shuffled = [...organelles].sort(() => Math.random() - 0.5)
    setAvailableOrganelles(shuffled)
    setPlacedOrganelles([])
    setSelectedOrganelle(null)
    setShowHint(false)
    setHintOrganelle(null)
    setFeedback(null)
    startGame()
  }, [organelles, startGame])

  const handleSelectOrganelle = useCallback((id: string) => {
    if (!state.isActive) return
    setSelectedOrganelle(prev => prev === id ? null : id)
    setShowHint(false)
    setHintOrganelle(null)
  }, [state.isActive])

  const handleDropOnZone = useCallback((zoneId: string) => {
    if (!selectedOrganelle || !state.isActive) return

    const organelle = availableOrganelles.find(o => o.id === selectedOrganelle)
    if (!organelle) return

    const isCorrect = organelle.correctZone === zoneId

    // Feedback visual
    setFeedback({ zoneId, type: isCorrect ? 'correct' : 'wrong' })

    if (isCorrect) {
      correctAnswer(20)
      setPlacedOrganelles(prev => [...prev, { id: organelle.id, zoneId, isCorrect }])
      setAvailableOrganelles(prev => prev.filter(o => o.id !== organelle.id))
    } else {
      wrongAnswer(5)
    }

    setSelectedOrganelle(null)

    setTimeout(() => {
      setFeedback(null)
    }, 500)
  }, [selectedOrganelle, availableOrganelles, state.isActive, correctAnswer, wrongAnswer])

  // Verificar se completou
  useEffect(() => {
    if (availableOrganelles.length === 0 && placedOrganelles.length === organelles.length && state.isActive) {
      if (!gameEndedRef.current) {
        gameEndedRef.current = true
        setTimeout(() => endGame(true), 500)
      }
    }
  }, [availableOrganelles.length, placedOrganelles.length, organelles.length, state.isActive, endGame])

  const handleShowHint = useCallback(() => {
    if (!selectedOrganelle) return
    const organelle = availableOrganelles.find(o => o.id === selectedOrganelle)
    if (organelle) {
      setShowHint(true)
      setHintOrganelle(organelle.correctZone)
    }
  }, [selectedOrganelle, availableOrganelles])

  const handleReset = useCallback(() => {
    const shuffled = [...organelles].sort(() => Math.random() - 0.5)
    setAvailableOrganelles(shuffled)
    setPlacedOrganelles([])
    setSelectedOrganelle(null)
    setShowHint(false)
    setHintOrganelle(null)
    setFeedback(null)
  }, [organelles])

  const getCellBackground = () => {
    switch (cellType) {
      case 'animal':
        return 'bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30'
      case 'vegetal':
        return 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30'
      case 'procarionte':
        return 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30'
      default:
        return 'bg-gradient-to-br from-primary/10 to-accent/10'
    }
  }

  const getCellTitle = () => {
    switch (cellType) {
      case 'animal': return 'Celula Animal'
      case 'vegetal': return 'Celula Vegetal'
      case 'procarionte': return 'Celula Procarionte'
      default: return 'Celula'
    }
  }

  return (
    <div className="min-h-screen bg-background bg-cell-pattern p-4">
      <div className="max-w-2xl mx-auto">
        <GameHeader
          title={config.title}
          score={state.score}
          targetScore={config.targetScore}
          timeRemaining={state.timeRemaining}
          timeLimit={config.timeLimit}
          combo={state.combo}
          onClose={onClose}
        />

        <p className="text-center text-muted-foreground mb-2 text-sm">
          {config.description}
        </p>

        {/* Tipo de celula */}
        <div className="text-center mb-4">
          <span className="px-3 py-1 bg-accent/20 rounded-full text-sm font-medium text-accent-foreground">
            {getCellTitle()}
          </span>
        </div>

        {/* Area da celula (drop zones) */}
        <div className={cn(
          "relative glass rounded-2xl p-4 mb-4 min-h-[300px]",
          getCellBackground()
        )}>
          {/* Membrana celular (borda) */}
          <div className="absolute inset-2 border-4 border-dashed border-primary/30 rounded-full" />

          {/* Drop zones */}
          <div className="relative h-[280px]">
            {dropZones.map(zone => {
              const placed = placedOrganelles.find(p => p.zoneId === zone.id)
              const placedOrganelle = placed ? organelles.find(o => o.id === placed.id) : null
              const isHinted = hintOrganelle === zone.id

              return (
                <button
                  key={zone.id}
                  onClick={() => handleDropOnZone(zone.id)}
                  disabled={!selectedOrganelle || !!placed}
                  className={cn(
                    "absolute flex flex-col items-center justify-center",
                    "rounded-xl border-2 border-dashed transition-all duration-200",
                    "text-xs font-medium",
                    placed ? "border-solid cursor-default" : "hover:border-solid cursor-pointer",
                    feedback?.zoneId === zone.id && feedback.type === 'correct' && "border-primary bg-primary/20 animate-pulse",
                    feedback?.zoneId === zone.id && feedback.type === 'wrong' && "border-destructive bg-destructive/20 animate-shake",
                    isHinted && "border-accent bg-accent/30 animate-pulse",
                    !placed && !feedback && !isHinted && "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/10",
                    placed && "border-primary/50 bg-card/80"
                  )}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {placed && placedOrganelle ? (
                    <div className="flex flex-col items-center gap-1 animate-bounce-in">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-semibold text-center px-1">
                        {placedOrganelle.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-center px-1">
                      {zone.label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Progresso */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-muted-foreground">
            Posicionadas: {placedOrganelles.length}/{organelles.length}
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-accent-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </button>
        </div>

        {/* Organelas disponiveis */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Move className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Selecione uma organela e clique na posicao correta
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableOrganelles.map(organelle => (
              <button
                key={organelle.id}
                onClick={() => handleSelectOrganelle(organelle.id)}
                disabled={!state.isActive}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-200",
                  "text-left hover:shadow-md",
                  selectedOrganelle === organelle.id
                    ? "border-primary bg-primary/10 shadow-lg scale-105"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <span className="font-semibold text-sm text-foreground block">
                  {organelle.name}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {organelle.description}
                </span>
              </button>
            ))}
          </div>

          {availableOrganelles.length === 0 && (
            <div className="text-center py-6 animate-bounce-in">
              <Check className="h-8 w-8 text-primary mx-auto mb-2" />
              <span className="text-lg font-bold text-primary">Celula completa!</span>
            </div>
          )}
        </div>

        {/* Botao de dica */}
        {selectedOrganelle && (
          <button
            onClick={handleShowHint}
            disabled={showHint}
            className={cn(
              "w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2",
              "bg-accent/20 text-accent-foreground border border-accent/30",
              "hover:bg-accent/30 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Lightbulb className="h-5 w-5" />
            {showHint ? 'Dica mostrada na celula!' : 'Mostrar dica (sem penalidade)'}
          </button>
        )}
      </div>
    </div>
  )
}
