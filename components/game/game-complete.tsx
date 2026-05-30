'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { GameProgress } from '@/lib/game-types'
import { 
  Trophy, 
  Medal, 
  Star, 
  RotateCcw, 
  FlaskConical, 
  CheckCircle2,
  Award,
  Sparkles,
  Target,
  Zap,
  Crown,
  Map
} from 'lucide-react'

interface GameCompleteProps {
  progress: GameProgress
  onRestart: () => void
  onBackToMap: () => void
}

function ConfettiParticle({ delay }: { delay: number }) {
  const colors = ['bg-primary', 'bg-accent', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomLeft = `${Math.random() * 100}%`
  const randomDuration = 3 + Math.random() * 3
  const randomSize = Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3'
  
  return (
    <div 
      className={`absolute ${randomSize} ${randomColor} rounded-full`}
      style={{
        left: randomLeft,
        top: '-20px',
        animation: `particle-float ${randomDuration}s ease-out forwards`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

function StatBadge({ icon: Icon, value, label, color }: {
  icon: React.ElementType
  value: string | number
  label: string
  color: string
}) {
  return (
    <div className={`glass rounded-xl p-4 text-center border ${color}`}>
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color.replace('border-', 'text-').replace('/50', '')}`} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function GameComplete({ progress, onRestart, onBackToMap }: GameCompleteProps) {
  const [showStats, setShowStats] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const percentage = Math.round((progress.correctAnswers.length / 30) * 100)
  
  const getRank = () => {
    if (percentage >= 90) return { 
      title: 'Mestre da Citologia', 
      icon: Crown, 
      color: 'text-primary',
      description: 'Voce domina completamente os conceitos de citologia!'
    }
    if (percentage >= 70) return { 
      title: 'Cientista Senior', 
      icon: Award, 
      color: 'text-accent',
      description: 'Excelente conhecimento! Voce esta pronto para o ENEM.'
    }
    if (percentage >= 50) return { 
      title: 'Pesquisador Promissor', 
      icon: Medal, 
      color: 'text-chart-3',
      description: 'Bom progresso! Continue estudando para aperfeicoar.'
    }
    return { 
      title: 'Aprendiz de Laboratorio', 
      icon: Star, 
      color: 'text-muted-foreground',
      description: 'Revise os conceitos e tente novamente!'
    }
  }

  const rank = getRank()

  useEffect(() => {
    const timer1 = setTimeout(() => setShowStats(true), 500)
    const timer2 = setTimeout(() => setShowMessage(true), 1200)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Animate score counter
  useEffect(() => {
    if (showStats) {
      const duration = 1500
      const steps = 30
      const increment = progress.score / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= progress.score) {
          setAnimatedScore(progress.score)
          clearInterval(timer)
        } else {
          setAnimatedScore(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [showStats, progress.score])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-grid">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-hex pointer-events-none" />
      
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <ConfettiParticle key={i} delay={i * 0.1} />
        ))}
      </div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Victory Animation */}
        <div className="mb-8 animate-in zoom-in-50 duration-700">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="w-20 h-20 text-primary" />
            </div>
            {/* Orbiting stars */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
              <Sparkles className="absolute -top-2 left-1/2 w-6 h-6 text-primary" />
              <Sparkles className="absolute top-1/2 -right-2 w-4 h-4 text-accent" />
              <Sparkles className="absolute -bottom-2 left-1/4 w-5 h-5 text-chart-3" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-glow">
            Missao Completa!
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Voce restaurou toda a memoria do Dr. Cell
          </p>
        </div>

        {/* Rank Display */}
        {showStats && (
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-500">
            <Card className="glass p-8 border-primary/30">
              <div className="flex items-center justify-center gap-3 mb-6">
                <rank.icon className={`w-10 h-10 ${rank.color}`} />
                <div className="text-left">
                  <span className={`text-2xl font-bold ${rank.color}`}>{rank.title}</span>
                  <p className="text-sm text-muted-foreground">{rank.description}</p>
                </div>
              </div>
              
              {/* Animated Score */}
              <div className="mb-8">
                <div className="text-7xl font-bold text-primary text-glow mb-2">
                  {animatedScore}
                </div>
                <p className="text-muted-foreground">pontos</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatBadge 
                  icon={CheckCircle2} 
                  value={progress.correctAnswers.length} 
                  label="Acertos" 
                  color="border-primary/50" 
                />
                <StatBadge 
                  icon={Target} 
                  value={`${percentage}%`} 
                  label="Precisao" 
                  color="border-accent/50" 
                />
                <StatBadge 
                  icon={Zap} 
                  value={30 - progress.correctAnswers.length} 
                  label="Erros" 
                  color="border-muted/50" 
                />
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Taxa de Acertos</span>
                  <span className="font-medium text-primary">{percentage}%</span>
                </div>
                <div className="relative">
                  <Progress value={percentage} className="h-4" />
                  <div 
                    className="absolute top-0 left-0 h-4 rounded-full bg-primary/30 animate-pulse"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Dr. Cell Message */}
        {showMessage && (
          <Card className="glass p-6 mb-8 border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20 flex-shrink-0">
                <FlaskConical className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Dr. Cell</p>
                <p className="text-foreground leading-relaxed text-lg">
                  {percentage >= 70 
                    ? 'Extraordinario, Detetive! Gracas a voce, todo o conhecimento cientifico foi restaurado. O Laboratorio Central agradece sua dedicacao! Voce esta mais do que preparado para o ENEM!'
                    : 'Obrigado por sua ajuda, Detetive. Embora nem todos os arquivos tenham sido restaurados perfeitamente, seu esforco foi valioso. Continue estudando para fortalecer ainda mais seu conhecimento!'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        {showMessage && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
            <Button 
              onClick={onRestart} 
              size="lg" 
              className="gap-2 glow-primary"
            >
              <RotateCcw className="w-4 h-4" />
              Jogar Novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={onBackToMap} 
              size="lg"
              className="gap-2"
            >
              <Map className="w-4 h-4" />
              Revisar Salas
            </Button>
          </div>
        )}
        
        {/* Footer */}
        {showMessage && (
          <p className="mt-8 text-sm text-muted-foreground animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
            Desenvolvido para ajudar estudantes a dominarem Citologia para o ENEM
          </p>
        )}
      </div>
    </div>
  )
}
