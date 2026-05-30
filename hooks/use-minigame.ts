'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { MinigameConfig, MinigameState } from '@/lib/minigame-types'

interface UseMinigameOptions {
  config: MinigameConfig
  onComplete: (success: boolean, score: number) => void
  onTimeUp?: () => void
}

export function useMinigame({ config, onComplete, onTimeUp }: UseMinigameOptions) {
  const [state, setState] = useState<MinigameState>({
    isActive: false,
    score: 0,
    timeRemaining: config.timeLimit,
    combo: 0,
    maxCombo: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    items: []
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isCompletedRef = useRef(false)

  const startGame = useCallback(() => {
    isCompletedRef.current = false
    setState({
      isActive: true,
      score: 0,
      timeRemaining: config.timeLimit,
      combo: 0,
      maxCombo: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      items: []
    })
  }, [config.timeLimit])

  const endGame = useCallback((forceSuccess?: boolean) => {
    if (isCompletedRef.current) return
    isCompletedRef.current = true
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setState(prev => {
      // Se forceSuccess for explicitamente definido (true ou false), usar esse valor
      // Caso contrário, calcular baseado no score
      const success = forceSuccess !== undefined ? forceSuccess : prev.score >= config.targetScore
      const finalScore = prev.score
      
      // Chamar onComplete fora do setState para evitar problemas
      setTimeout(() => {
        onComplete(success, finalScore)
      }, 100)
      return { ...prev, isActive: false }
    })
  }, [config.targetScore, onComplete])

  const addScore = useCallback((points: number, isCorrect: boolean = true) => {
    setState(prev => {
      if (!prev.isActive) return prev

      const newCombo = isCorrect ? prev.combo + 1 : 0
      const comboMultiplier = Math.min(1 + Math.floor(newCombo / 3) * 0.5, 3)
      const finalPoints = isCorrect ? Math.floor(points * comboMultiplier) : 0

      return {
        ...prev,
        score: prev.score + finalPoints,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1
      }
    })
  }, [])

  const correctAnswer = useCallback((points: number = 10) => {
    addScore(points, true)
  }, [addScore])

  const wrongAnswer = useCallback((penalty: number = 0) => {
    setState(prev => ({
      ...prev,
      combo: 0,
      wrongAnswers: prev.wrongAnswers + 1,
      score: Math.max(0, prev.score - penalty)
    }))
  }, [])

  const resetCombo = useCallback(() => {
    setState(prev => ({ ...prev, combo: 0 }))
  }, [])

  // Timer
  useEffect(() => {
    if (!state.isActive) return

    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          onTimeUp?.()
          return { ...prev, timeRemaining: 0 }
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [state.isActive, onTimeUp])

  // Auto-end when time is up
  useEffect(() => {
    if (state.isActive && state.timeRemaining <= 0) {
      endGame()
    }
  }, [state.isActive, state.timeRemaining, endGame])

  // Check if target score reached
  useEffect(() => {
    if (state.isActive && state.score >= config.targetScore) {
      // Continue playing to get more points, but mark as success
    }
  }, [state.score, config.targetScore, state.isActive])

  return {
    state,
    startGame,
    endGame,
    correctAnswer,
    wrongAnswer,
    addScore,
    resetCombo,
    isSuccess: state.score >= config.targetScore,
    progress: Math.min(100, (state.score / config.targetScore) * 100),
    timeProgress: (state.timeRemaining / config.timeLimit) * 100
  }
}
