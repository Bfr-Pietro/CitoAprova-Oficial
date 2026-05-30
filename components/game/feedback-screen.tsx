'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Question } from '@/lib/game-types'
import { 
  CheckCircle2, 
  XCircle, 
  FlaskConical, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen,
  Sparkles,
  Trophy,
  Target,
  Zap
} from 'lucide-react'

interface FeedbackScreenProps {
  question: Question
  isCorrect: boolean
  userAnswer: string
  onNext: () => void
  score: number
}

function ConfettiParticle({ delay }: { delay: number }) {
  const colors = ['bg-primary', 'bg-accent', 'bg-chart-3', 'bg-chart-4']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomLeft = `${Math.random() * 100}%`
  const randomDuration = 2 + Math.random() * 2
  
  return (
    <div 
      className={`absolute w-2 h-2 ${randomColor} rounded-full`}
      style={{
        left: randomLeft,
        top: '-10px',
        animation: `particle-float ${randomDuration}s ease-out forwards`,
        animationDelay: `${delay}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }}
    />
  )
}

export function FeedbackScreen({ question, isCorrect, userAnswer, onNext, score }: FeedbackScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [showPoints, setShowPoints] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 300)
    const timer2 = setTimeout(() => setShowPoints(true), 800)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onNext])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-grid">
      {/* Background based on result */}
      <div className={`
        absolute inset-0 transition-opacity duration-1000
        ${isCorrect 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background' 
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-destructive/20 via-background to-background'
        }
      `} />
      
      {/* Confetti for correct answers */}
      {isCorrect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.1} />
          ))}
        </div>
      )}
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Result Header */}
        <div className={`
          text-center mb-8 p-8 rounded-2xl glass
          animate-in zoom-in-95 duration-500
          ${isCorrect 
            ? 'border-primary/50' 
            : 'border-destructive/50'
          }
        `}>
          <div className={`
            relative w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6
            ${isCorrect ? 'bg-primary/20' : 'bg-destructive/20'}
            ${isCorrect ? 'animate-success-pulse' : 'animate-shake'}
          `}>
            {isCorrect ? (
              <CheckCircle2 className="w-14 h-14 text-primary" />
            ) : (
              <XCircle className="w-14 h-14 text-destructive" />
            )}
            {isCorrect && (
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            )}
          </div>
          
          <h1 className={`
            text-3xl md:text-4xl font-bold mb-3
            ${isCorrect ? 'text-primary text-glow' : 'text-destructive text-glow-destructive'}
          `}>
            {isCorrect ? 'Excelente trabalho!' : 'Nao foi dessa vez...'}
          </h1>
          
          {isCorrect && showPoints && (
            <div className="flex items-center justify-center gap-2 animate-in zoom-in duration-300">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">+10 pontos</span>
            </div>
          )}
        </div>

        {showContent && (
          <>
            {/* Character Response */}
            <Card className={`
              glass p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500
              ${isCorrect ? 'border-primary/40' : 'border-destructive/40'}
            `}>
              <div className="flex items-start gap-4">
                <div className={`
                  p-4 rounded-xl flex-shrink-0
                  ${isCorrect ? 'bg-primary/20' : 'bg-destructive/20'}
                `}>
                  {isCorrect ? (
                    <FlaskConical className="w-8 h-8 text-primary" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  )}
                </div>
                
                <div>
                  <p className={`
                    text-sm font-bold uppercase tracking-wider mb-2
                    ${isCorrect ? 'text-primary' : 'text-destructive'}
                  `}>
                    {isCorrect ? 'Dr. Cell' : 'Fragmento'}
                  </p>
                  <p className="text-foreground text-lg leading-relaxed">
                    {isCorrect 
                      ? 'Voce restaurou parte da memoria cientifica! Continue assim, Detetive. Cada acerto nos aproxima da vitoria!'
                      : 'Hahaha... parece que o detetive precisa estudar mais. Mas nao se preocupe, Dr. Cell vai explicar o conceito correto.'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Answers Comparison */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* User's Answer */}
              <Card className="glass p-5 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">Sua resposta</p>
                </div>
                <p className="text-foreground leading-relaxed">{userAnswer}</p>
              </Card>

              {/* Expected Answer */}
              <Card className="glass p-5 border-primary/30 animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-primary">Resposta esperada</p>
                </div>
                <p className="text-foreground font-medium leading-relaxed">{question.expectedAnswer}</p>
              </Card>
            </div>

            {/* Scientific Explanation */}
            <Card className="glass p-6 mb-6 border-accent/30 bg-accent/5 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/20 flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Explicacao Cientifica
                  </p>
                  <p className="text-foreground leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </Card>

            {/* Score and Next */}
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Pontuacao total</p>
                  <p className="text-xl font-bold text-primary">{score} pontos</p>
                </div>
              </div>
              
              <Button 
                onClick={onNext} 
                size="lg" 
                className="gap-2 glow-primary min-w-[180px]"
              >
                Proximo Caso
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Keyboard hint */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              Pressione <kbd className="px-2 py-0.5 bg-secondary rounded text-xs mx-1">Enter</kbd> para continuar
            </p>
          </>
        )}
      </div>
    </div>
  )
}
