'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { GameProgress } from '@/lib/minigame-types'
import { PHASES } from '@/lib/phases-data'
import { useAuth } from '@/contexts/auth-context'
import { getUserProgress, saveUserProgress, type GameProgressData } from '@/lib/firebase/firestore-service'

interface ExtendedProgress extends GameProgress {
  streak: number
  lastPlayedDate: string | null
}

const initialProgress: ExtendedProgress = {
  currentPhase: 1,
  currentMinigame: 0,
  completedPhases: [],
  phaseScores: {},
  totalScore: 0,
  lives: 3,
  unlockedBlocks: [1],
  streak: 0,
  lastPlayedDate: null
}

// Helper to get today's date as YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Helper to check if date is yesterday
const isYesterday = (dateStr: string) => {
  const date = new Date(dateStr)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]
}

// Helper to check if date is today
const isToday = (dateStr: string) => {
  return dateStr === getTodayDate()
}

export function useGameProgress() {
  const { user, firebaseUser, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState<ExtendedProgress>(initialProgress)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedProgressRef = useRef<string>('')
  const isInitialLoadRef = useRef(true)
  const hasLoadedFromFirebaseRef = useRef(false)

  // Load progress from Firebase only (requires authentication)
  useEffect(() => {
    const loadProgress = async () => {
      try {
        let loadedProgress: ExtendedProgress | null = null

        // Only load from Firebase if authenticated
        if (isAuthenticated && firebaseUser) {
          const firebaseProgress = await getUserProgress(firebaseUser.uid)
          if (firebaseProgress) {
            loadedProgress = {
              currentPhase: firebaseProgress.currentPhase,
              currentMinigame: firebaseProgress.currentMinigame,
              completedPhases: firebaseProgress.completedPhases,
              phaseScores: firebaseProgress.phaseScores,
              totalScore: firebaseProgress.totalScore,
              lives: firebaseProgress.lives,
              unlockedBlocks: firebaseProgress.unlockedBlocks,
              streak: firebaseProgress.streak,
              lastPlayedDate: firebaseProgress.lastPlayedDate
            }
            hasLoadedFromFirebaseRef.current = true
            // Store the loaded progress as last saved to prevent re-saving on load
            lastSavedProgressRef.current = JSON.stringify(loadedProgress)
          }
        }

        if (loadedProgress) {
          let newStreak = loadedProgress.streak || 0
          
          // Check if streak should be reset
          if (loadedProgress.lastPlayedDate) {
            if (!isToday(loadedProgress.lastPlayedDate) && !isYesterday(loadedProgress.lastPlayedDate)) {
              newStreak = 0
            }
          }
          
          const finalProgress = { ...initialProgress, ...loadedProgress, streak: newStreak }
          setProgress(finalProgress)
          // Update the last saved ref to include streak changes
          lastSavedProgressRef.current = JSON.stringify(finalProgress)
        }
      } catch (e) {
        console.error('Erro ao carregar progresso:', e)
      }
      
      // Mark initial load as complete
      isInitialLoadRef.current = false
      setIsLoaded(true)
    }

    loadProgress()
  }, [isAuthenticated, firebaseUser])

  // Save to Firebase only (debounced)
  const saveProgress = useCallback(async (progressToSave: ExtendedProgress) => {
    // Don't save during initial load or if not authenticated
    if (isInitialLoadRef.current || !isAuthenticated || !firebaseUser) {
      return
    }
    
    const progressString = JSON.stringify(progressToSave)
    
    // Only save if progress actually changed
    if (progressString === lastSavedProgressRef.current) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Debounce Firebase saves
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true)
      try {
        const firestoreProgress: GameProgressData = {
          currentPhase: progressToSave.currentPhase,
          currentMinigame: progressToSave.currentMinigame,
          completedPhases: progressToSave.completedPhases,
          phaseScores: progressToSave.phaseScores,
          totalScore: progressToSave.totalScore,
          lives: progressToSave.lives,
          unlockedBlocks: progressToSave.unlockedBlocks,
          streak: progressToSave.streak,
          lastPlayedDate: progressToSave.lastPlayedDate
        }

        await saveUserProgress(firebaseUser.uid, firestoreProgress)
        lastSavedProgressRef.current = progressString
      } catch (e) {
        console.error('Erro ao sincronizar progresso:', e)
      } finally {
        setIsSyncing(false)
      }
    }, 1000) // 1 second debounce
  }, [isAuthenticated, firebaseUser])

  // Save progress when it changes
  useEffect(() => {
    if (isLoaded) {
      saveProgress(progress)
    }
  }, [progress, isLoaded, saveProgress])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update streak when playing
  const updateStreak = useCallback(() => {
    setProgress(prev => {
      const today = getTodayDate()
      
      if (prev.lastPlayedDate === today) {
        return prev
      }
      
      let newStreak = prev.streak
      
      if (prev.lastPlayedDate === null) {
        newStreak = 1
      } else if (isYesterday(prev.lastPlayedDate)) {
        newStreak = prev.streak + 1
      } else if (!isToday(prev.lastPlayedDate)) {
        newStreak = 1
      }
      
      return {
        ...prev,
        streak: newStreak,
        lastPlayedDate: today
      }
    })
  }, [])

  const completeMinigame = useCallback((phaseId: number, minigameIndex: number, score: number) => {
    updateStreak()
    
    setProgress(prev => {
      const phaseScore = (prev.phaseScores[phaseId] || 0) + score
      return {
        ...prev,
        phaseScores: { ...prev.phaseScores, [phaseId]: phaseScore },
        totalScore: prev.totalScore + score,
        currentMinigame: minigameIndex + 1
      }
    })
  }, [updateStreak])

  const completePhase = useCallback((phaseId: number) => {
    setProgress(prev => {
      if (prev.completedPhases.includes(phaseId)) return prev

      const newCompleted = [...prev.completedPhases, phaseId]
      
      const phase = PHASES.find(p => p.id === phaseId)
      const currentBlock = phase?.blockId || 1
      const blockPhases = PHASES.filter(p => p.blockId === currentBlock)
      const allBlockCompleted = blockPhases.every(p => newCompleted.includes(p.id))
      
      let newUnlocked = prev.unlockedBlocks
      if (allBlockCompleted && !prev.unlockedBlocks.includes(currentBlock + 1)) {
        newUnlocked = [...prev.unlockedBlocks, currentBlock + 1]
      }

      return {
        ...prev,
        completedPhases: newCompleted,
        unlockedBlocks: newUnlocked,
        currentPhase: phaseId + 1,
        currentMinigame: 0
      }
    })
  }, [])

  const setCurrentPhase = useCallback((phaseId: number) => {
    setProgress(prev => ({
      ...prev,
      currentPhase: phaseId,
      currentMinigame: 0
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(initialProgress)
    lastSavedProgressRef.current = ''
    // Save reset to Firebase
    if (firebaseUser) {
      saveUserProgress(firebaseUser.uid, initialProgress)
    }
  }, [firebaseUser])

  const getPhaseMinigamesCompleted = useCallback((phaseId: number): number[] => {
    const phase = PHASES.find(p => p.id === phaseId)
    if (!phase) return []
    
    if (progress.completedPhases.includes(phaseId)) {
      return phase.minigames.map((_, i) => i)
    }
    
    if (progress.currentPhase === phaseId) {
      return Array.from({ length: progress.currentMinigame }, (_, i) => i)
    }
    
    return []
  }, [progress])

  const addScore = useCallback((score: number) => {
    setProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + score
    }))
  }, [])

  const loseLife = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1)
    }))
  }, [])

  const setInitialLives = useCallback((lives: number) => {
    setProgress(prev => ({
      ...prev,
      lives
    }))
  }, [])

  // Admin: unlock all phases (only for admin users)
  const unlockAllPhases = useCallback(() => {
    setProgress(prev => {
      const updated = {
        ...prev,
        unlockedBlocks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
      // Save to Firebase immediately (no debounce)
      if (firebaseUser) {
        saveUserProgress(firebaseUser.uid, updated)
      }
      return updated
    })
  }, [firebaseUser])

  // Admin: set specific phase
  const adminSetPhase = useCallback((phaseId: number) => {
    setProgress(prev => ({
      ...prev,
      currentPhase: phaseId,
      currentMinigame: 0
    }))
  }, [])

  return {
    progress,
    isLoaded,
    isSyncing,
    completedPhases: progress.completedPhases,
    totalScore: progress.totalScore,
    lives: progress.lives,
    currentPhase: progress.currentPhase,
    streak: progress.streak,
    unlockedBlocks: progress.unlockedBlocks,
    completeMinigame,
    completePhase,
    setCurrentPhase,
    resetProgress,
    getPhaseMinigamesCompleted,
    addScore,
    loseLife,
    setInitialLives,
    updateStreak,
    // Admin functions
    unlockAllPhases,
    adminSetPhase
  }
}
