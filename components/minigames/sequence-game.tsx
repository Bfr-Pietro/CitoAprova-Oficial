'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, GripVertical } from 'lucide-react'

interface SequenceItem {
  id: string
  content: string
  correctOrder: number
  currentOrder: number
}

interface SequenceGameProps {
  config: MinigameConfig
  items: Array<{ content: string; order: number }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function SequenceGame({ config, items, onComplete, onClose }: SequenceGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [sequenceItems, setSequenceItems] = useState<SequenceItem[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const isProcessingRef = useRef(false)

  // Inicializar itens embaralhados
  useEffect(() => {
    // Reset ref ao iniciar novo jogo
    isProcessingRef.current = false
    setIsChecked(false)
    
    // Criar itens com ordem correta baseada no campo 'order' original
    // O correctOrder representa a posicao final correta (0, 1, 2, ...)
    // baseado na ordenacao pelo campo 'order'
    const sortedByOrder = [...items].sort((a, b) => a.order - b.order)
    
    const itemsWithCorrectOrder = items.map((item, originalIndex) => {
      // Encontrar qual posicao este item deve ocupar na ordem correta
      const correctPosition = sortedByOrder.findIndex(sorted => sorted.content === item.content && sorted.order === item.order)
      return {
        id: `item-${originalIndex}`,
        content: item.content,
        correctOrder: correctPosition,
        currentOrder: originalIndex
      }
    })
    
    // Embaralhar a ordem atual
    const shuffled = itemsWithCorrectOrder
      .sort(() => Math.random() - 0.5)
      .map((item, i) => ({ ...item, currentOrder: i }))
    
    setSequenceItems(shuffled)
    startGame()
  }, [items, startGame])

  const handleDragStart = useCallback((itemId: string) => {
    setDraggedItem(itemId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    setSequenceItems(prev => {
      const items = [...prev]
      const draggedIndex = items.findIndex(i => i.id === draggedItem)
      const targetIndex = items.findIndex(i => i.id === targetId)
      
      if (draggedIndex === -1 || targetIndex === -1) return prev

      // Trocar posicoes
      const [removed] = items.splice(draggedIndex, 1)
      items.splice(targetIndex, 0, removed)
      
      // Atualizar currentOrder
      return items.map((item, i) => ({ ...item, currentOrder: i }))
    })
  }, [draggedItem])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
  }, [])

  // Para touch devices
  const [touchItem, setTouchItem] = useState<string | null>(null)

  const handleTouchSelect = useCallback((itemId: string) => {
    if (!touchItem) {
      setTouchItem(itemId)
    } else if (touchItem === itemId) {
      setTouchItem(null)
    } else {
      // Trocar posicoes
      setSequenceItems(prev => {
        const items = [...prev]
        const firstIndex = items.findIndex(i => i.id === touchItem)
        const secondIndex = items.findIndex(i => i.id === itemId)
        
        if (firstIndex === -1 || secondIndex === -1) return prev

        // Trocar
        ;[items[firstIndex], items[secondIndex]] = [items[secondIndex], items[firstIndex]]
        
        return items.map((item, idx) => ({ ...item, currentOrder: idx }))
      })
      setTouchItem(null)
    }
  }, [touchItem])

  const checkSequence = useCallback(() => {
    if (isChecked || isProcessingRef.current) return
    isProcessingRef.current = true
    setIsChecked(true)

    const isCorrect = sequenceItems.every(item => item.currentOrder === item.correctOrder)
    
    if (isCorrect) {
      correctAnswer(config.targetScore)
      setTimeout(() => {
        endGame(true)
        isProcessingRef.current = false
      }, 1000)
    } else {
      wrongAnswer(20)
      setTimeout(() => {
        setIsChecked(false)
        isProcessingRef.current = false
      }, 1500)
    }
  }, [sequenceItems, isChecked, correctAnswer, wrongAnswer, endGame, config.targetScore])

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

        {/* Lista de itens */}
        <div className="space-y-2 mb-6">
          {sequenceItems.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleTouchSelect(item.id)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-move",
                "bg-card hover:border-primary/50",
                draggedItem === item.id && "opacity-50 scale-95",
                touchItem === item.id && "border-accent bg-accent/10",
                isChecked && item.currentOrder === item.correctOrder && "border-primary bg-primary/10",
                isChecked && item.currentOrder !== item.correctOrder && "border-destructive bg-destructive/10 animate-shake"
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold">
                {index + 1}
              </div>
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 font-medium">{item.content}</span>
              {isChecked && item.currentOrder === item.correctOrder && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          ))}
        </div>

        {/* Botao de verificar */}
        <button
          onClick={checkSequence}
          disabled={isChecked}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg transition-all",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground",
            "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
            isChecked && "opacity-50 cursor-not-allowed"
          )}
        >
          Verificar Ordem
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Arraste os itens para reorganizar ou toque em dois para trocar
        </p>
      </div>
    </div>
  )
}
