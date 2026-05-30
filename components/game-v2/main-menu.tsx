'use client'

import Image from 'next/image'
import { Play, BookOpen, Gamepad2, Settings, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MainMenuProps {
  onStartGame: () => void
  progress: {
    completedPhases: number[]
    totalScore: number
    lives: number
    isLoaded: boolean
  }
  playerName?: string
  onBackToHome?: () => void
  onGoToLearn?: () => void
  onGoToAchievements?: () => void
  onGoToMinigames?: () => void
  onGoToOptions?: () => void
}

export function MainMenu({ onStartGame, progress, playerName, onBackToHome, onGoToLearn, onGoToAchievements, onGoToMinigames, onGoToOptions }: MainMenuProps) {
  const completedPhases = progress?.completedPhases || []
  const totalScore = progress?.totalScore || 0
  const hasProgress = completedPhases.length > 0

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cell-bg w-48 sm:w-64 h-48 sm:h-64 -top-20 -left-20 animate-cell-pulse" />
        <div className="cell-bg w-36 sm:w-48 h-36 sm:h-48 top-1/3 -right-16 animate-cell-pulse" style={{ animationDelay: '1s' }} />
        <div className="cell-bg w-44 sm:w-56 h-44 sm:h-56 -bottom-20 left-1/4 animate-cell-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
        {/* Logo */}
        <div className="relative mb-6 sm:mb-8 animate-float">
          <Image
            src="/images/logo.png"
            alt="CitoAprova"
            width={280}
            height={88}
            priority
            className="h-auto w-[200px] sm:w-[240px] md:w-[280px] drop-shadow-lg"
          />
          <div className="absolute inset-0 blur-xl -z-10 animate-pulse-glow bg-gradient-to-r from-primary/30 to-accent/30 rounded-full" />
        </div>

        {playerName && (
          <p className="text-base sm:text-lg text-primary font-medium mb-2">
            Olá, {playerName}!
          </p>
        )}
        <p className="text-muted-foreground text-center mb-6 sm:mb-8 max-w-xs text-sm sm:text-base px-4">
          Explore o mundo das células através de minigames educativos
        </p>

        {/* Stats */}
        {hasProgress && (
          <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{completedPhases.length}/30</div>
              <div className="text-xs text-muted-foreground">Fases</div>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-accent">{totalScore}</div>
              <div className="text-xs text-muted-foreground">Pontos</div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3 px-4">
          {hasProgress ? (
            <>
              <Button
                onClick={onStartGame}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Play className="w-5 h-5 mr-2" />
                Continuar
              </Button>
              <Button
                onClick={onStartGame}
                variant="outline"
                className="w-full h-10 sm:h-12"
              >
                Selecionar Fase
              </Button>
            </>
          ) : (
            <Button
              onClick={onStartGame}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Play className="w-5 h-5 mr-2" />
              Comecar Aventura
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 flex justify-center gap-6 sm:gap-8 safe-area-bottom">
        {onBackToHome && (
          <button 
            onClick={onBackToHome}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs">Início</span>
          </button>
        )}
        <button 
          onClick={onGoToLearn}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-xs">Aprender</span>
        </button>
        <button 
          onClick={onGoToMinigames}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-xs">Minigames</span>
        </button>
        <button 
          onClick={onGoToOptions}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs">Opções</span>
        </button>
      </div>

      {/* Credits */}
      <p className="text-center text-xs text-muted-foreground pb-4">
        Um jogo educativo sobre Biologia Celular
      </p>
    </div>
  )
}
