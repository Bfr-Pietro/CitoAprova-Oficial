'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { rooms } from '@/lib/game-data'
import { 
  ScrollText, 
  Microscope, 
  Building2, 
  Leaf, 
  Shield, 
  Truck, 
  Factory, 
  Zap, 
  Brain,
  Lock,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Star,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import type { GameProgress } from '@/lib/game-types'

interface LabMapProps {
  progress: GameProgress
  onSelectRoom: (roomId: number) => void
  onReset: () => void
  getRoomProgress: (roomId: number) => { answered: number; total: number; correct: number }
}

const iconMap: Record<string, React.ElementType> = {
  scroll: ScrollText,
  microscope: Microscope,
  building: Building2,
  leaf: Leaf,
  shield: Shield,
  truck: Truck,
  factory: Factory,
  zap: Zap,
  brain: Brain
}

function StatCard({ icon: Icon, value, label, color }: { 
  icon: React.ElementType
  value: string | number
  label: string
  color: string 
}) {
  return (
    <div className={`glass rounded-xl p-4 flex items-center gap-3 border ${color}`}>
      <div className={`p-2 rounded-lg ${color.replace('border-', 'bg-').replace('/50', '/20')}`}>
        <Icon className={`w-5 h-5 ${color.replace('border-', 'text-').replace('/50', '')}`} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function LabMap({ progress, onSelectRoom, onReset, getRoomProgress }: LabMapProps) {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)
  const totalProgress = (progress.answeredQuestions.length / 30) * 100
  const accuracy = progress.answeredQuestions.length > 0 
    ? Math.round((progress.correctAnswers.length / progress.answeredQuestions.length) * 100) 
    : 0

  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-grid">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-hex pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-glow">
                  Laboratorio Central
                </h1>
                <p className="text-muted-foreground mt-1">
                  Selecione uma sala para investigar
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onReset} 
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar Jogo
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              icon={Trophy} 
              value={progress.score} 
              label="Pontos" 
              color="border-primary/50" 
            />
            <StatCard 
              icon={CheckCircle2} 
              value={progress.correctAnswers.length} 
              label="Acertos" 
              color="border-accent/50" 
            />
            <StatCard 
              icon={Star} 
              value={`${accuracy}%`} 
              label="Precisao" 
              color="border-chart-3/50" 
            />
            <StatCard 
              icon={Microscope} 
              value={`${progress.answeredQuestions.length}/30`} 
              label="Investigados" 
              color="border-chart-5/50" 
            />
          </div>

          {/* Overall Progress */}
          <Card className="glass p-5 border-primary/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold">Progresso da Missao</span>
              </div>
              <span className="text-sm text-primary font-medium">
                {Math.round(totalProgress)}% completo
              </span>
            </div>
            <div className="relative">
              <Progress value={totalProgress} className="h-4 bg-secondary" />
              {totalProgress > 0 && (
                <div 
                  className="absolute top-0 left-0 h-4 rounded-full bg-primary/20 animate-pulse"
                  style={{ width: `${totalProgress}%` }}
                />
              )}
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-primary flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {progress.correctAnswers.length} respostas corretas
              </span>
              <span className="text-muted-foreground">
                {progress.answeredQuestions.length - progress.correctAnswers.length} incorretas
              </span>
            </div>
          </Card>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room, index) => {
            const Icon = iconMap[room.icon] || Building2
            const isUnlocked = progress.unlockedRooms.includes(room.id)
            const roomProgress = getRoomProgress(room.id)
            const isComplete = roomProgress.answered === roomProgress.total && roomProgress.total > 0
            const progressPercent = (roomProgress.answered / roomProgress.total) * 100
            const isHovered = hoveredRoom === room.id

            return (
              <Card
                key={room.id}
                className={`
                  relative overflow-hidden transition-all duration-500 group
                  animate-in fade-in slide-in-from-bottom-4
                  ${isUnlocked 
                    ? 'cursor-pointer glass hover:border-primary/70 hover:scale-[1.02]' 
                    : 'opacity-50 bg-muted/20'
                  } 
                  ${isComplete ? 'border-primary/50 bg-primary/5' : 'border-border/50'}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => isUnlocked && onSelectRoom(room.id)}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Glow effect on hover */}
                {isUnlocked && isHovered && (
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                )}
                
                {/* Room number badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                    transition-all duration-300
                    ${isComplete 
                      ? 'bg-primary text-primary-foreground glow-primary' 
                      : isUnlocked 
                        ? 'bg-secondary text-secondary-foreground group-hover:bg-primary/20' 
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isUnlocked ? (
                      room.id
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-xl flex items-center justify-center mb-4
                    transition-all duration-300
                    ${isUnlocked 
                      ? isComplete 
                        ? 'bg-primary/30' 
                        : 'bg-primary/20 group-hover:bg-primary/30 group-hover:scale-110' 
                      : 'bg-muted/50'
                    }
                  `}>
                    {isUnlocked ? (
                      <Icon className={`w-8 h-8 ${isComplete ? 'text-primary' : 'text-primary/80'}`} />
                    ) : (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Room Info */}
                  <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-sm text-primary/80 font-medium mb-2">{room.theme}</p>
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Progress Section */}
                  {isUnlocked ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Casos {room.casesRange[0]}-{room.casesRange[1]}
                        </span>
                        <span className="font-medium">
                          {roomProgress.answered}/{roomProgress.total}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={progressPercent} 
                          className="h-2 bg-secondary"
                        />
                      </div>
                      {roomProgress.answered > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-primary flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {roomProgress.correct} acertos
                          </span>
                          {roomProgress.answered > roomProgress.correct && (
                            <span className="text-muted-foreground">
                              {roomProgress.answered - roomProgress.correct} erros
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* CTA on hover */}
                      <div className={`
                        flex items-center justify-center gap-2 pt-3 text-sm font-medium text-primary
                        transition-all duration-300
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                      `}>
                        {isComplete ? 'Revisar Sala' : 'Entrar na Sala'}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                      <Lock className="w-3 h-3" />
                      <span>Complete a sala anterior para desbloquear</span>
                    </div>
                  )}
                </div>

                {/* Decorative corner */}
                {isComplete && (
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/10 rounded-tl-full" />
                )}
              </Card>
            )
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in duration-700">
          <p>Complete todas as salas para restaurar completamente a memoria do Dr. Cell</p>
        </div>
      </div>
    </div>
  )
}
