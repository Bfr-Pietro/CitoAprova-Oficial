'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, X, Lightbulb, BookOpen } from 'lucide-react'

interface OrganelleQuizGameProps {
  config: MinigameConfig
  questions: Array<{
    question: string
    image?: string
    options: string[]
    correctIndex: number
    explanation: string
    category: string
  }>
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function OrganelleQuizGame({ config, questions, onComplete, onClose }: OrganelleQuizGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const gameEndedRef = useRef(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setHintsUsed(0)
    setEliminatedOptions([])
    setStreak(0)
    startGame()
  }, [questions, startGame])

  // Reset para nova questao
  useEffect(() => {
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setEliminatedOptions([])
  }, [currentQuestionIndex])

  const handleSelectAnswer = useCallback((index: number) => {
    if (showResult || !state.isActive || eliminatedOptions.includes(index)) return
    setSelectedAnswer(index)
  }, [showResult, state.isActive, eliminatedOptions])

  const handleConfirm = useCallback(() => {
    if (selectedAnswer === null || !state.isActive || showResult) return

    setShowResult(true)
    const isCorrect = selectedAnswer === currentQuestion.correctIndex

    if (isCorrect) {
      // Bonus por streak
      const streakBonus = Math.min(streak, 5) * 5
      // Penalidade por dicas usadas
      const hintPenalty = eliminatedOptions.length * 5
      correctAnswer(25 + streakBonus - hintPenalty)
      setStreak(prev => prev + 1)
    } else {
      wrongAnswer(5)
      setStreak(0)
      setShowExplanation(true)
    }

    // Avancar apos delay
    setTimeout(() => {
      if (currentQuestionIndex >= totalQuestions - 1) {
        if (!gameEndedRef.current) {
          gameEndedRef.current = true
          endGame()
        }
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, isCorrect ? 1200 : 2500)
  }, [selectedAnswer, currentQuestion, state.isActive, showResult, streak, eliminatedOptions.length, correctAnswer, wrongAnswer, currentQuestionIndex, totalQuestions, endGame])

  const handleUseHint = useCallback(() => {
    if (eliminatedOptions.length >= 2 || !state.isActive || showResult) return

    // Eliminar uma opcao errada aleatoria
    const wrongOptions = currentQuestion.options
      .map((_, index) => index)
      .filter(i => i !== currentQuestion.correctIndex && !eliminatedOptions.includes(i))

    if (wrongOptions.length > 0) {
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
      setEliminatedOptions(prev => [...prev, randomWrong])
      setHintsUsed(prev => prev + 1)
      
      // Se a opcao selecionada foi eliminada, deselecionar
      if (selectedAnswer === randomWrong) {
        setSelectedAnswer(null)
      }
    }
  }, [eliminatedOptions, state.isActive, showResult, currentQuestion, selectedAnswer])

  const getOptionStyle = (index: number) => {
    const isSelected = selectedAnswer === index
    const isCorrect = index === currentQuestion.correctIndex
    const isEliminated = eliminatedOptions.includes(index)

    if (isEliminated) {
      return "opacity-30 cursor-not-allowed line-through"
    }

    if (showResult) {
      if (isCorrect) {
        return "border-primary bg-primary/20 text-primary"
      }
      if (isSelected && !isCorrect) {
        return "border-destructive bg-destructive/20 text-destructive"
      }
      return "opacity-50"
    }

    if (isSelected) {
      return "border-primary bg-primary/10 shadow-md scale-[1.02]"
    }

    return "border-border hover:border-primary/50 hover:bg-primary/5"
  }

  if (!currentQuestion) return null

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

        <p className="text-center text-muted-foreground mb-2 text-sm">
          {config.description}
        </p>

        {/* Progresso e streak */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Questao {currentQuestionIndex + 1}/{totalQuestions}
            </span>
            <span className="px-2 py-0.5 bg-accent/20 rounded-full text-xs">
              {currentQuestion.category}
            </span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-chart-4/20 rounded-full animate-bounce-in">
              <span className="text-sm font-bold text-chart-4">{streak}x</span>
              <span className="text-xs text-chart-4">seguidas!</span>
            </div>
          )}
        </div>

        {/* Barra de progresso das questoes */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i < currentQuestionIndex ? "bg-primary" :
                i === currentQuestionIndex ? "bg-accent animate-pulse" :
                "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Questao */}
        <div className="glass rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-foreground leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Imagem (se houver) */}
          {currentQuestion.image && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                  [Imagem: {currentQuestion.image}]
                </div>
              </div>
            </div>
          )}

          {/* Opcoes */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult || eliminatedOptions.includes(index)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "flex items-center gap-3",
                  getOptionStyle(index)
                )}
              >
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                  "border-2 transition-all",
                  selectedAnswer === index && !showResult && "border-primary bg-primary text-primary-foreground",
                  showResult && index === currentQuestion.correctIndex && "border-primary bg-primary text-primary-foreground",
                  showResult && selectedAnswer === index && index !== currentQuestion.correctIndex && "border-destructive bg-destructive text-destructive-foreground",
                  !showResult && selectedAnswer !== index && "border-muted-foreground/30"
                )}>
                  {showResult && index === currentQuestion.correctIndex ? (
                    <Check className="h-4 w-4" />
                  ) : showResult && selectedAnswer === index ? (
                    <X className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>

          {/* Explicacao */}
          {showExplanation && (
            <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/30 animate-slide-up">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-accent-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botoes de acao */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleUseHint}
            disabled={eliminatedOptions.length >= 2 || showResult}
            className={cn(
              "py-3 rounded-xl flex items-center justify-center gap-2",
              "bg-accent/20 text-accent-foreground border border-accent/30",
              "hover:bg-accent/30 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Lightbulb className="h-5 w-5" />
            <span className="text-sm">
              50/50 {eliminatedOptions.length > 0 ? `(${2 - eliminatedOptions.length} restante)` : '(-5 pts)'}
            </span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedAnswer === null || showResult}
            className={cn(
              "py-3 rounded-xl font-bold transition-all",
              "bg-gradient-to-r from-primary to-accent text-primary-foreground",
              "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Confirmar
          </button>
        </div>

        {/* Estatisticas */}
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span>Dicas usadas: {hintsUsed}</span>
          <span>Melhor sequencia: {streak}</span>
        </div>
      </div>
    </div>
  )
}
