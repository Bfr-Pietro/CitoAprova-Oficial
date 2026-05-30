'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { rooms, questions } from '@/lib/game-data'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  XCircle,
  Trophy,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import type { GameProgress } from '@/lib/game-types'

interface RoomViewProps {
  roomId: number
  progress: GameProgress
  onStartCase: (questionId: number) => void
  onBack: () => void
}

export function RoomView({ roomId, progress, onStartCase, onBack }: RoomViewProps) {
  const [hoveredCase, setHoveredCase] = useState<number | null>(null)
  const room = rooms.find(r => r.id === roomId)
  if (!room) return null

  const [start, end] = room.casesRange
  const roomQuestions = questions.filter(q => q.id >= start && q.id <= end)
  const answeredCount = roomQuestions.filter(q => progress.answeredQuestions.includes(q.id)).length
  const correctCount = roomQuestions.filter(q => progress.correctAnswers.includes(q.id)).length
  const allComplete = answeredCount === roomQuestions.length

  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-grid">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-4 hover:bg-primary/10 hover:text-primary gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Mapa
          </Button>
          
          <Card className="glass p-6 border-primary/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase tracking-wider">Sala {room.id}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-glow">{room.name}</h1>
                <p className="text-primary/80 font-medium mb-1">{room.theme}</p>
                <p className="text-muted-foreground">{room.description}</p>
              </div>
              
              <div className="flex flex-row md:flex-col gap-3">
                <div className="glass rounded-xl p-3 text-center min-w-[80px] border border-primary/30">
                  <p className="text-2xl font-bold text-primary">{correctCount}</p>
                  <p className="text-xs text-muted-foreground">Acertos</p>
                </div>
                <div className="glass rounded-xl p-3 text-center min-w-[80px] border border-border/50">
                  <p className="text-2xl font-bold">{answeredCount}/{roomQuestions.length}</p>
                  <p className="text-xs text-muted-foreground">Progresso</p>
                </div>
              </div>
            </div>
            
            {/* Room progress bar */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso da Sala</span>
                <span className="font-medium">{Math.round((answeredCount / roomQuestions.length) * 100)}%</span>
              </div>
              <Progress value={(answeredCount / roomQuestions.length) * 100} className="h-2" />
            </div>
          </Card>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Casos para Investigar
            </h2>
            <span className="text-sm text-muted-foreground">
              {roomQuestions.length - answeredCount} pendentes
            </span>
          </div>
          
          {roomQuestions.map((question, index) => {
            const isAnswered = progress.answeredQuestions.includes(question.id)
            const isCorrect = progress.correctAnswers.includes(question.id)
            const isHovered = hoveredCase === question.id

            return (
              <Card
                key={question.id}
                className={`
                  group relative overflow-hidden transition-all duration-300
                  animate-in fade-in slide-in-from-left-4
                  ${isAnswered 
                    ? isCorrect 
                      ? 'glass border-primary/40 bg-primary/5' 
                      : 'glass border-destructive/40 bg-destructive/5'
                    : 'glass hover:border-primary/50 cursor-pointer hover:scale-[1.01]'
                  }
                `}
                style={{ animationDelay: `${index * 75}ms` }}
                onClick={() => !isAnswered && onStartCase(question.id)}
                onMouseEnter={() => setHoveredCase(question.id)}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${isAnswered 
                        ? isCorrect 
                          ? 'bg-primary/20' 
                          : 'bg-destructive/20'
                        : 'bg-secondary group-hover:bg-primary/20 group-hover:scale-110'
                      }
                    `}>
                      {isAnswered ? (
                        isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <XCircle className="w-6 h-6 text-destructive" />
                        )
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                      )}
                    </div>
                    
                    {/* Case Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          Caso {question.id}
                        </span>
                        {isAnswered && (
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full font-medium
                            ${isCorrect 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-destructive/20 text-destructive'
                            }
                          `}>
                            {isCorrect ? 'Resolvido' : 'Investigado'}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {question.caseTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {question.dialogues.find(d => d.speaker === 'narrative')?.text.slice(0, 150) || question.dialogues[0]?.text.slice(0, 150) || 'Investigue este caso...'}...
                      </p>
                    </div>
                    
                    {/* Action Button */}
                    {!isAnswered && (
                      <div className={`
                        flex-shrink-0 transition-all duration-300
                        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                      `}>
                        <Button size="sm" className="gap-2 glow-primary">
                          <PlayCircle className="w-4 h-4" />
                          Investigar
                        </Button>
                      </div>
                    )}
                    
                    {/* Correct indicator */}
                    {isAnswered && isCorrect && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <Trophy className="w-4 h-4" />
                          +10 pts
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover indicator for unanswered */}
                {!isAnswered && (
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1 bg-primary
                    transition-transform duration-300 origin-left
                    ${isHovered ? 'scale-x-100' : 'scale-x-0'}
                  `} />
                )}
              </Card>
            )
          })}
        </div>

        {/* All Complete Message */}
        {allComplete && (
          <Card className="mt-8 glass p-8 border-primary/50 text-center animate-in zoom-in-95 duration-500">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <CheckCircle2 className="w-20 h-20 text-primary" />
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </div>
            <h3 className="font-bold text-2xl mb-2 text-glow">Sala Completa!</h3>
            <p className="text-muted-foreground mb-2">
              Voce investigou todos os {roomQuestions.length} casos desta sala.
            </p>
            <p className="text-primary font-medium mb-6">
              {correctCount} de {roomQuestions.length} respostas corretas ({Math.round((correctCount / roomQuestions.length) * 100)}%)
            </p>
            {roomId < 9 && (
              <p className="text-sm text-accent mb-6 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                A proxima sala foi desbloqueada!
              </p>
            )}
            <Button onClick={onBack} size="lg" className="gap-2">
              Voltar ao Mapa do Laboratorio
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
