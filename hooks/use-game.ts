'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { GameProgress, GameState, Question } from '@/lib/game-types'
import { questions, rooms } from '@/lib/game-data'
import { useAuth } from '@/contexts/auth-context'
import { getUserProgress, saveUserProgress, type GameProgressData } from '@/lib/firebase/firestore-service'

const initialProgress: GameProgress = {
  currentCase: 1,
  score: 0,
  answeredQuestions: [],
  correctAnswers: [],
  unlockedRooms: [1]
}

const initialState: GameState = {
  phase: 'intro',
  currentRoom: null,
  currentQuestion: null,
  showNarrative: false,
  lastAnswer: null
}

// Normalize text for comparison (remove accents and convert to lowercase)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Check if answer contains any of the keywords
function checkAnswerMatch(answer: string, keywords: string[]): boolean {
  const normalizedAnswer = normalizeText(answer)
  
  return keywords.some(keyword => {
    const normalizedKeyword = normalizeText(keyword)
    // Check for exact word match or phrase match
    const words = normalizedAnswer.split(/\s+/)
    const keywordWords = normalizedKeyword.split(/\s+/)
    
    // If keyword is a single word, check if it exists as a word
    if (keywordWords.length === 1) {
      return words.some(word => word.includes(normalizedKeyword) || normalizedKeyword.includes(word))
    }
    
    // If keyword is a phrase, check if the phrase exists in the answer
    return normalizedAnswer.includes(normalizedKeyword)
  })
}

export function useGame() {
  const { firebaseUser, isAuthenticated } = useAuth()
  const [progress, setProgress] = useState<GameProgress>(initialProgress)
  const [state, setState] = useState<GameState>(initialState)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Audio refs for sound effects (optional, works without audio too)
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null)
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)

  // Load progress from Firebase only
  useEffect(() => {
    const loadProgress = async () => {
      if (isAuthenticated && firebaseUser) {
        try {
          const saved = await getUserProgress(firebaseUser.uid)
          if (saved) {
            setProgress({
              currentCase: saved.currentPhase || 1,
              score: saved.totalScore || 0,
              answeredQuestions: saved.completedPhases || [],
              correctAnswers: saved.completedPhases || [],
              unlockedRooms: saved.unlockedBlocks || [1]
            })
          }
        } catch (e) {
          console.error('Error loading progress:', e)
        }
      }
      setIsLoaded(true)
    }
    loadProgress()
  }, [isAuthenticated, firebaseUser])

  // Save progress to Firebase
  useEffect(() => {
    const saveToFirebase = async () => {
      if (isLoaded && isAuthenticated && firebaseUser) {
        try {
          await saveUserProgress(firebaseUser.uid, {
            currentPhase: progress.currentCase,
            currentMinigame: 0,
            completedPhases: progress.answeredQuestions,
            phaseScores: {},
            totalScore: progress.score,
            lives: 3,
            unlockedBlocks: progress.unlockedRooms,
            streak: 0,
            lastPlayedDate: new Date().toISOString().split('T')[0]
          })
        } catch (e) {
          console.error('Error saving progress:', e)
        }
      }
    }
    saveToFirebase()
  }, [progress, isLoaded, isAuthenticated, firebaseUser])

  // Calculate which rooms should be unlocked based on answered questions
  const calculateUnlockedRooms = useCallback((answeredQuestions: number[]): number[] => {
    const unlockedRooms = [1] // Room 1 is always unlocked
    
    rooms.forEach(room => {
      const [start, end] = room.casesRange
      const roomQuestions = questions.filter(q => q.id >= start && q.id <= end)
      const allAnswered = roomQuestions.every(q => answeredQuestions.includes(q.id))
      
      if (allAnswered && room.id < 9 && !unlockedRooms.includes(room.id + 1)) {
        unlockedRooms.push(room.id + 1)
      }
    })
    
    return unlockedRooms.sort((a, b) => a - b)
  }, [])

  const startGame = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'map' }))
      setIsTransitioning(false)
    }, 200)
  }, [])

  const selectRoom = useCallback((roomId: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (room && progress.unlockedRooms.includes(roomId)) {
      setIsTransitioning(true)
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          phase: 'room', 
          currentRoom: roomId 
        }))
        setIsTransitioning(false)
      }, 200)
    }
  }, [progress.unlockedRooms])

  const startCase = useCallback((questionId: number) => {
    const question = questions.find(q => q.id === questionId)
    if (question) {
      setIsTransitioning(true)
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          phase: 'case',
          currentQuestion: question,
          showNarrative: true,
          lastAnswer: null
        }))
        setIsTransitioning(false)
      }, 200)
    }
  }, [])

  const proceedToQuestion = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        phase: 'question',
        showNarrative: false 
      }))
      setIsTransitioning(false)
    }, 200)
  }, [])

  const checkAnswer = useCallback((userAnswer: string) => {
    if (!state.currentQuestion) return

    const isCorrect = checkAnswerMatch(userAnswer, state.currentQuestion.keywords)
    const questionId = state.currentQuestion.id

    // Play sound effect
    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {})
    } else {
      wrongSoundRef.current?.play().catch(() => {})
    }

    setProgress(prev => {
      const newAnswered = prev.answeredQuestions.includes(questionId) 
        ? prev.answeredQuestions 
        : [...prev.answeredQuestions, questionId]
      
      const newCorrect = isCorrect && !prev.correctAnswers.includes(questionId)
        ? [...prev.correctAnswers, questionId]
        : prev.correctAnswers

      const newUnlockedRooms = calculateUnlockedRooms(newAnswered)

      return {
        ...prev,
        score: newCorrect.length * 10,
        answeredQuestions: newAnswered,
        correctAnswers: newCorrect,
        unlockedRooms: newUnlockedRooms,
        currentCase: Math.max(prev.currentCase, questionId + 1)
      }
    })

    setState(prev => ({
      ...prev,
      phase: 'feedback',
      lastAnswer: { isCorrect, userAnswer }
    }))
  }, [state.currentQuestion, calculateUnlockedRooms])

  const nextQuestion = useCallback(() => {
    if (!state.currentQuestion || !state.currentRoom) return

    const room = rooms.find(r => r.id === state.currentRoom)
    if (!room) return

    const [start, end] = room.casesRange
    const nextQuestionId = state.currentQuestion.id + 1

    setIsTransitioning(true)
    setTimeout(() => {
      if (nextQuestionId <= end) {
        const nextQ = questions.find(q => q.id === nextQuestionId)
        if (nextQ) {
          setState(prev => ({
            ...prev,
            phase: 'case',
            currentQuestion: nextQ,
            showNarrative: true,
            lastAnswer: null
          }))
        }
      } else {
        // Check if game is complete
        const totalAnswered = progress.answeredQuestions.length
        if (totalAnswered >= 30 || (totalAnswered >= 29 && !progress.answeredQuestions.includes(state.currentQuestion!.id))) {
          setState(prev => ({ ...prev, phase: 'complete' }))
        } else {
          setState(prev => ({ 
            ...prev, 
            phase: 'map',
            currentRoom: null,
            currentQuestion: null
          }))
        }
      }
      setIsTransitioning(false)
    }, 300)
  }, [state.currentQuestion, state.currentRoom, progress.answeredQuestions])

  const backToMap = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        phase: 'map',
        currentRoom: null,
        currentQuestion: null,
        lastAnswer: null
      }))
      setIsTransitioning(false)
    }, 200)
  }, [])

  const backToRoom = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        phase: 'room',
        currentQuestion: null,
        lastAnswer: null
      }))
      setIsTransitioning(false)
    }, 200)
  }, [])

  const resetGame = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setProgress(initialProgress)
      setState(initialState)
      // Reset will be saved automatically via the useEffect
      setIsTransitioning(false)
    }, 200)
  }, [])

  const getRoomProgress = useCallback((roomId: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return { answered: 0, total: 0, correct: 0 }

    const [start, end] = room.casesRange
    const roomQuestions = questions.filter(q => q.id >= start && q.id <= end)
    const answered = roomQuestions.filter(q => progress.answeredQuestions.includes(q.id)).length
    const correct = roomQuestions.filter(q => progress.correctAnswers.includes(q.id)).length

    return { answered, total: roomQuestions.length, correct }
  }, [progress])

  // Get overall game stats
  const getGameStats = useCallback(() => {
    return {
      totalQuestions: 30,
      answeredQuestions: progress.answeredQuestions.length,
      correctAnswers: progress.correctAnswers.length,
      score: progress.score,
      accuracy: progress.answeredQuestions.length > 0 
        ? Math.round((progress.correctAnswers.length / progress.answeredQuestions.length) * 100)
        : 0,
      unlockedRooms: progress.unlockedRooms.length,
      totalRooms: 9
    }
  }, [progress])

  return {
    progress,
    state,
    isLoaded,
    isTransitioning,
    startGame,
    selectRoom,
    startCase,
    proceedToQuestion,
    checkAnswer,
    nextQuestion,
    backToMap,
    backToRoom,
    resetGame,
    getRoomProgress,
    getGameStats
  }
}
