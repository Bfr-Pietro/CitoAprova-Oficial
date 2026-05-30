'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Check, X, ArrowRight } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correctIndex: number
}

interface ShuffledQuestion {
  question: string
  options: string[]
  correctIndex: number
}

// Embaralha as opções de uma pergunta e retorna o novo índice correto
function shuffleOptions(question: Question): ShuffledQuestion {
  const correctAnswer = question.options[question.correctIndex]
  const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswer)
  
  return {
    question: question.question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex
  }
}

interface QuizArcadeProps {
  config: MinigameConfig
  questions: Question[]
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

export function QuizArcade({ config, questions, onComplete, onClose }: QuizArcadeProps) {
  // Embaralha as perguntas e as opções de cada pergunta
  const shuffledQuestions = useMemo(() => {
    return questions
      .sort(() => Math.random() - 0.5)
      .map(q => shuffleOptions(q))
  }, [questions])
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10)
  const [hasAnswered, setHasAnswered] = useState(false)

  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  // Ref para controlar se o timeout já foi processado
  const timeoutProcessedRef = useRef(false)

  // Timer por pergunta
  useEffect(() => {
    if (!state.isActive || showResult || hasAnswered) return

    // Reset timeout flag quando uma nova pergunta começa
    timeoutProcessedRef.current = false

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [state.isActive, showResult, currentQuestionIndex, hasAnswered])

  // Quando o tempo da pergunta acaba - handle timeout separately
  useEffect(() => {
    if (questionTimeLeft === 0 && !showResult && state.isActive && !hasAnswered && !timeoutProcessedRef.current) {
      timeoutProcessedRef.current = true
      setHasAnswered(true)
      setSelectedAnswer(-1)
      setShowResult(true)
      wrongAnswer(10)
    }
  }, [questionTimeLeft, showResult, state.isActive, hasAnswered, wrongAnswer])

  const handleAnswer = useCallback((index: number) => {
    if (showResult || !state.isActive || hasAnswered) return

    setHasAnswered(true)
    setSelectedAnswer(index)
    setShowResult(true)

    const isCorrect = index === currentQuestion.correctIndex
    
    if (isCorrect) {
      // Bonus por tempo restante
      const timeBonus = Math.floor(questionTimeLeft * 2)
      correctAnswer(20 + timeBonus)
    } else {
      wrongAnswer(10)
    }
  }, [showResult, state.isActive, currentQuestion, questionTimeLeft, correctAnswer, wrongAnswer, hasAnswered])

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex >= shuffledQuestions.length - 1) {
      endGame()
      return
    }

    // Reset timeout flag antes de ir para próxima pergunta
    timeoutProcessedRef.current = false
    setCurrentQuestionIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuestionTimeLeft(10)
    setHasAnswered(false)
  }, [currentQuestionIndex, shuffledQuestions.length, endGame])

  // Iniciar jogo
  useEffect(() => {
    // Reset ref ao iniciar novo jogo
    timeoutProcessedRef.current = false
    startGame()
  }, [startGame])

  if (!currentQuestion) {
    return null
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

        {/* Progress das perguntas */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Pergunta {currentQuestionIndex + 1} de {shuffledQuestions.length}
          </span>
          <div className="flex gap-1">
            {shuffledQuestions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < currentQuestionIndex ? "bg-primary" :
                  i === currentQuestionIndex ? "bg-accent" :
                  "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Timer da pergunta */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Tempo da pergunta</span>
            <span className={cn(
              "font-mono font-bold",
              questionTimeLeft <= 3 ? "text-destructive animate-timer-pulse" : "text-foreground"
            )}>
              {questionTimeLeft}s
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                questionTimeLeft <= 3 ? "bg-destructive" : "bg-accent"
              )}
              style={{ width: `${(questionTimeLeft / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-foreground text-center">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Opcoes */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === currentQuestion.correctIndex
            // CORREÇÃO: showCorrect só é true se o usuário clicou nesta opção E ela é a correta
            // Isso evita que a resposta correta seja destacada automaticamente no timeout
            const showCorrect = showResult && isSelected && isCorrect
            const showWrong = showResult && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                  "flex items-center justify-between",
                  showCorrect
                    ? "border-primary bg-primary/10 text-primary"
                    : showWrong
                      ? "border-destructive bg-destructive/10 text-destructive animate-shake"
                      : isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                    showCorrect
                      ? "bg-primary text-primary-foreground"
                      : showWrong
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-secondary text-secondary-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
                
                {showCorrect && <Check className="h-5 w-5" />}
                {showWrong && <X className="h-5 w-5" />}
              </button>
            )
          })}
        </div>

        {/* Botao de proxima */}
        {showResult && (
          <button
            onClick={nextQuestion}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all animate-slide-up",
              "bg-gradient-to-r from-primary to-accent text-primary-foreground",
              "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
              "flex items-center justify-center gap-2"
            )}
          >
            {currentQuestionIndex >= shuffledQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}