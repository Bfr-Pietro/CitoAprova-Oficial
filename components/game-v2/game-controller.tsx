'use client'

import { useState, useCallback, useEffect } from 'react'
import { MainMenu } from './main-menu'
import { usePageTransition } from '@/contexts/transition-context'
import { PhaseSelector } from './phase-selector'
import { PhaseScreen } from './phase-screen'
import { MinigameRunner } from './minigame-runner'
import { StoryNarrator } from './story-narrator'
import { useGameProgress } from '@/hooks/use-game-progress'
import { PHASES } from '@/lib/phases-data'
import { getPhaseStory, getDefaultStory } from '@/lib/story-data'
import { getGameConfig, saveGameConfig, type GameConfigData } from '@/lib/firebase/firestore-service'
import { useAuth } from '@/contexts/auth-context'
import type { Phase } from '@/lib/minigame-types'
import type { PhaseStory } from '@/lib/story-data'
import { Trophy, Star, Sparkles, Play, Clock, Target, Zap, ChevronLeft, BookOpen, Settings, User, Award, Gamepad2, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

type GameScreen = 
  | 'menu' 
  | 'phases' 
  | 'phase-intro' 
  | 'story-intro' 
  | 'story-villain' 
  | 'minigame-ready' 
  | 'playing' 
  | 'story-conclusion'
  | 'victory' 
  | 'game-over'
  | 'learn'
  | 'achievements'
  | 'minigames-list'
  | 'ranking'
  | 'options'
  | 'profile'

interface GameConfig {
  mode: 'historia' | 'pratica'
  difficulty: 'facil' | 'normal' | 'dificil'
  playerName: string
}

export function GameController() {
  const { navigateTo } = usePageTransition()
  const { isAdmin, firebaseUser, isAuthenticated } = useAuth()
  const [screen, setScreen] = useState<GameScreen>('menu')
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null)
  const [currentStory, setCurrentStory] = useState<PhaseStory | null>(null)
  const [currentMinigameIndex, setCurrentMinigameIndex] = useState(0)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)
  const progress = useGameProgress()

  // Carregar configuracoes do jogo do Firebase
  useEffect(() => {
    const loadConfig = async () => {
      if (isAuthenticated && firebaseUser) {
        try {
          const savedConfig = await getGameConfig(firebaseUser.uid)
          if (savedConfig) {
            setGameConfig({
              mode: savedConfig.mode,
              difficulty: savedConfig.difficulty,
              playerName: savedConfig.playerName
            })
          }
        } catch (e) {
          console.error('Error loading game config:', e)
        }
      }
    }
    loadConfig()
  }, [isAuthenticated, firebaseUser])

  const handleStartGame = useCallback(() => {
    setScreen('phases')
  }, [])

  const handleSelectPhase = useCallback((phase: Phase) => {
    setCurrentPhase(phase)
    setCurrentMinigameIndex(0)
    
    // Buscar a historia da fase
    const story = getPhaseStory(phase.id) || getDefaultStory(phase.id, phase.title, phase.theme)
    setCurrentStory(story)
    
    // Se o modo e historia, mostrar a narrativa. Senao, ir direto para a intro da fase
    if (gameConfig?.mode === 'historia') {
      setScreen('story-intro')
    } else {
      setScreen('phase-intro')
    }
  }, [gameConfig])

  const handleStoryIntroComplete = useCallback(() => {
    // Apos a introducao, mostrar o desafio do vilao
    setScreen('story-villain')
  }, [])

  const handleVillainChallengeComplete = useCallback(() => {
    // Apos o desafio do vilao, mostrar tela de preparacao do minigame
    setScreen('minigame-ready')
  }, [])

  const handleMinigameReady = useCallback(() => {
    // Iniciar o minigame apos o jogador clicar em comecar
    setScreen('playing')
  }, [])

  const handleSkipStory = useCallback(() => {
    // Pular a historia e ir para tela de preparacao do minigame
    setScreen('minigame-ready')
  }, [])

  const handleStartPhase = useCallback(() => {
    // Se o modo e historia e ainda nao viu a narrativa, mostrar
    if (gameConfig?.mode === 'historia' && currentStory) {
      setScreen('story-intro')
    } else {
      // No modo pratica, ir direto para tela de preparacao do minigame
      setScreen('minigame-ready')
    }
  }, [gameConfig, currentStory])

  const handleMinigameComplete = useCallback((success: boolean, score: number) => {
    if (!currentPhase) return

    if (success) {
      progress.addScore(score)
      
      // Verificar se completou todos os minigames da fase
      if (currentMinigameIndex >= currentPhase.minigames.length - 1) {
        // Fase completa!
        progress.completePhase(currentPhase.id)
        
        // Se modo historia, mostrar conclusao. Senao, ir para vitoria
        if (gameConfig?.mode === 'historia' && currentStory) {
          setScreen('story-conclusion')
        } else {
          setScreen('victory')
        }
} else {
  // Proximo minigame - mostrar tela de preparacao
  setCurrentMinigameIndex(prev => prev + 1)
  setScreen('minigame-ready')
  }
  } else {
  // Game over - perdeu uma vida
      const livesAfterLoss = progress.lives - 1
      progress.loseLife()
      
      if (livesAfterLoss <= 0) {
        setScreen('game-over')
      } else {
        // Tentar novamente - volta para selecao de fase
        setScreen('phase-intro')
      }
    }
  }, [currentPhase, currentMinigameIndex, progress, gameConfig, currentStory])

  const handleConclusionComplete = useCallback(() => {
    setScreen('victory')
  }, [])

  const handleBackToPhases = useCallback(() => {
    setCurrentPhase(null)
    setCurrentStory(null)
    setCurrentMinigameIndex(0)
    setScreen('phases')
  }, [])

const handleRetry = useCallback(() => {
  setCurrentMinigameIndex(0)
  
  // Resetar vidas baseado na dificuldade quando tentar novamente
  if (gameConfig?.difficulty === 'facil') {
    progress.setInitialLives(5)
  } else if (gameConfig?.difficulty === 'dificil') {
    progress.setInitialLives(2)
  } else {
    progress.setInitialLives(3)
  }
  
  // Se modo historia, mostrar o desafio do vilao novamente
  if (gameConfig?.mode === 'historia' && currentStory) {
    setScreen('story-villain')
  } else {
    // No modo pratica, ir para tela de preparacao do minigame
    setScreen('minigame-ready')
  }
}, [gameConfig, currentStory, progress])

  const handleBackToMenu = useCallback(() => {
    setCurrentPhase(null)
    setCurrentStory(null)
    setCurrentMinigameIndex(0)
    setScreen('menu')
  }, [])

  const handleBackToHome = useCallback(() => {
    navigateTo('/')
  }, [navigateTo])

  // Handlers para navegacao do menu principal
  const handleGoToLearn = useCallback(() => {
    setScreen('learn')
  }, [])

  // Handlers para voltar da tela de ranking (pode ser chamado do menu ou das fases)
  const [rankingReturnScreen, setRankingReturnScreen] = useState<'menu' | 'phases'>('menu')
  // Handler para voltar da tela de achievements
  const [achievementsReturnScreen, setAchievementsReturnScreen] = useState<'menu' | 'phases'>('menu')

  const handleGoToAchievements = useCallback(() => {
    setAchievementsReturnScreen('menu')
    setScreen('achievements')
  }, [])

  const handleGoToAchievementsFromPhases = useCallback(() => {
    setAchievementsReturnScreen('phases')
    setScreen('achievements')
  }, [])

  const handleBackFromAchievements = useCallback(() => {
    setScreen(achievementsReturnScreen)
  }, [achievementsReturnScreen])

  const handleGoToMinigames = useCallback(() => {
    setScreen('minigames-list')
  }, [])

  const handleGoToRanking = useCallback(() => {
    setScreen('ranking')
  }, [])

  const handleGoToRankingFromMenu = useCallback(() => {
    setRankingReturnScreen('menu')
    setScreen('ranking')
  }, [])

  const handleGoToRankingFromPhases = useCallback(() => {
    setRankingReturnScreen('phases')
    setScreen('ranking')
  }, [])

  const handleBackFromRanking = useCallback(() => {
    setScreen(rankingReturnScreen)
  }, [rankingReturnScreen])

  const handleGoToOptions = useCallback(() => {
    setScreen('options')
  }, [])

  const handleGoToProfile = useCallback(() => {
    setScreen('profile')
  }, [])

  // Renderizar a tela atual
  switch (screen) {
    case 'menu':
      return (
        <MainMenu 
          onStartGame={handleStartGame} 
          progress={progress} 
          playerName={gameConfig?.playerName} 
          onBackToHome={handleBackToHome}
          onGoToLearn={handleGoToLearn}
          onGoToAchievements={handleGoToAchievements}
          onGoToMinigames={handleGoToMinigames}
          onGoToOptions={handleGoToOptions}
        />
      )
    
    case 'phases':
      return (
        <PhaseSelector 
          phases={PHASES}
          completedPhases={progress.completedPhases}
          currentPhaseIndex={progress.completedPhases.length}
          onSelectPhase={handleSelectPhase}
          onBack={handleBackToMenu}
          totalScore={progress.totalScore}
          streak={progress.streak}
          isAdmin={isAdmin}
          onGoToAchievements={handleGoToAchievementsFromPhases}
          onGoToRanking={handleGoToRankingFromPhases}
          onGoToProfile={handleGoToProfile}
        />
      )
    
    case 'phase-intro':
      return currentPhase ? (
        <PhaseScreen 
          phase={currentPhase}
          onStart={handleStartPhase}
          onBack={handleBackToPhases}
        />
      ) : null
    
    case 'story-intro':
      // Fallback: se nao tiver historia, pula para o villain challenge
      if (!currentStory) {
        // Usar useEffect para evitar render issues - retornar loading temporario
        setTimeout(() => handleStoryIntroComplete(), 0)
        return <LoadingScreen message="Carregando historia..." />
      }
      return (
        <StoryNarrator
          story={currentStory}
          storyType="introduction"
          onComplete={handleStoryIntroComplete}
          onSkip={handleSkipStory}
        />
      )
    
    case 'story-villain':
      // Fallback: se nao tiver historia, pula para o jogo
      if (!currentStory) {
        setTimeout(() => handleVillainChallengeComplete(), 0)
        return <LoadingScreen message="Preparando desafio..." />
      }
      return (
        <StoryNarrator
          story={currentStory}
          storyType="villainChallenge"
          onComplete={handleVillainChallengeComplete}
          onSkip={handleSkipStory}
        />
      )
    
    case 'minigame-ready':
      if (!currentPhase || !currentPhase.minigames[currentMinigameIndex]) {
        setTimeout(() => handleBackToPhases(), 0)
        return <LoadingScreen message="Carregando minigame..." />
      }
      return (
        <MinigameReadyScreen
          minigame={currentPhase.minigames[currentMinigameIndex]}
          minigameIndex={currentMinigameIndex}
          totalMinigames={currentPhase.minigames.length}
          phaseName={currentPhase.title}
          difficulty={gameConfig?.difficulty || 'normal'}
          onStart={handleMinigameReady}
          onBack={handleBackToPhases}
        />
      )
    
    case 'playing':
      if (!currentPhase || !currentPhase.minigames[currentMinigameIndex]) {
        setTimeout(() => handleBackToPhases(), 0)
        return <LoadingScreen message="Carregando minigame..." />
      }
      return (
        <MinigameRunner
          phase={currentPhase}
          minigame={currentPhase.minigames[currentMinigameIndex]}
          minigameIndex={currentMinigameIndex}
          onComplete={handleMinigameComplete}
          onClose={handleBackToPhases}
          difficulty={gameConfig?.difficulty || 'normal'}
        />
      )
    
    case 'story-conclusion':
      // Fallback: se nao tiver historia, vai para vitoria
      if (!currentStory) {
        setTimeout(() => handleConclusionComplete(), 0)
        return <LoadingScreen message="Finalizando..." />
      }
      return (
        <StoryNarrator
          story={currentStory}
          storyType="conclusion"
          onComplete={handleConclusionComplete}
        />
      )
    
    case 'victory':
      return (
        <VictoryScreen 
          phase={currentPhase}
          score={progress.totalScore}
          onContinue={handleBackToPhases}
        />
      )
    
    case 'game-over':
      return (
        <GameOverScreen 
          onRetry={handleRetry}
          onBack={handleBackToPhases}
        />
      )
    
    case 'learn':
      return <LearnScreen onBack={handleBackToMenu} />
    
    case 'achievements':
      return <AchievementsScreen progress={progress} onBack={handleBackFromAchievements} />
    
    case 'minigames-list':
      return <MinigamesListScreen onBack={handleBackToMenu} />
    
    case 'ranking':
      return <RankingScreen onBack={handleBackFromRanking} />
    
    case 'options':
      return <OptionsScreen gameConfig={gameConfig} onBack={handleBackToMenu} onConfigUpdate={setGameConfig} />
    
    case 'profile':
      return <ProfileScreenFull onBack={handleBackToPhases} />
    
    default:
      return null
  }
}

// Tela de Loading
function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  )
}

// Tela de Vitoria
function VictoryScreen({ phase, score, onContinue }: { 
  phase: Phase | null
  score: number
  onContinue: () => void 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      {/* Celulas decorativas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 animate-float"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-300 max-w-md w-full text-center mx-4">
        <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-black text-emerald-600 mb-2">
            Fase Completa!
          </h1>
          {phase && (
            <p className="text-base sm:text-lg text-gray-600 mb-4">{phase.title}</p>
          )}
          
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star} 
                className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 fill-yellow-400 animate-pulse"
                style={{ animationDelay: `${star * 0.2}s` }}
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Pontuação Total</p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">{score.toLocaleString()}</p>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-emerald-600 mb-4 sm:mb-6 text-sm sm:text-base">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Voce aprendeu sobre {phase?.theme}!</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg h-auto"
          >
            Continuar Jornada
          </Button>
        </div>
      </div>
    </div>
  )
}

// Tela de Game Over
function GameOverScreen({ onRetry, onBack }: { 
  onRetry: () => void
  onBack: () => void 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-200 max-w-md w-full text-center mx-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <span className="text-3xl sm:text-4xl">😵</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-red-500 mb-2">
          Fim de Jogo!
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Suas vidas acabaram, mas nao desista! A celula precisa de voce!
        </p>

        <div className="bg-red-50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-red-400">
            Dica: Preste atencao nas instrucoes de cada minigame e tente novamente!
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <Button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg h-auto"
          >
            Tentar Novamente
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full border-2 border-gray-300 text-gray-600 font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg h-auto"
          >
            Voltar ao Mapa
          </Button>
        </div>
      </div>
    </div>
  )
}

// Tela de Preparacao do Minigame
import type { MinigameConfig } from '@/lib/minigame-types'

function MinigameReadyScreen({ 
  minigame, 
  minigameIndex, 
  totalMinigames,
  phaseName,
  difficulty,
  onStart, 
  onBack 
}: { 
  minigame: MinigameConfig
  minigameIndex: number
  totalMinigames: number
  phaseName: string
  difficulty: 'facil' | 'normal' | 'dificil'
  onStart: () => void
  onBack: () => void 
}) {
  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'facil':
        return { label: 'Fácil', color: 'text-emerald-500', bgColor: 'bg-emerald-100', timeBonus: '+20%', scoreReduction: '-20%' }
      case 'dificil':
        return { label: 'Difícil', color: 'text-red-500', bgColor: 'bg-red-100', timeBonus: '-20%', scoreReduction: '+30%' }
      default:
        return { label: 'Normal', color: 'text-amber-500', bgColor: 'bg-amber-100', timeBonus: '0%', scoreReduction: '0%' }
    }
  }

  const diffInfo = getDifficultyInfo()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </button>
          <span className="text-gray-400 text-sm">
            {phaseName} - Minigame {minigameIndex + 1}/{totalMinigames}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Icone do minigame */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Titulo */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            {minigame.title}
          </h1>
          <p className="text-gray-400 text-center mb-6">
            {minigame.description}
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-white font-bold">{minigame.timeLimit}s</p>
              <p className="text-gray-400 text-xs">Tempo</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-white font-bold">{minigame.targetScore}</p>
              <p className="text-gray-400 text-xs">Meta</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Zap className={`w-5 h-5 mx-auto mb-1 ${diffInfo.color}`} />
              <p className="text-white font-bold">{diffInfo.label}</p>
              <p className="text-gray-400 text-xs">Dificuldade</p>
            </div>
          </div>

          {/* Dica */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <p className="text-amber-200 text-sm text-center">
              <span className="font-bold">Dica:</span> Acerte em sequencia para ganhar bonus de combo!
            </p>
          </div>

          {/* Botao de iniciar */}
          <Button
            onClick={onStart}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white rounded-xl shadow-lg shadow-cyan-500/30"
          >
            <Play className="w-6 h-6 mr-2" />
            Comecar Minigame
          </Button>

          <p className="text-center text-gray-500 text-xs mt-4">
            Prepare-se! O tempo comeca quando voce clicar em comecar.
          </p>
        </div>
      </div>
    </div>
  )
}

// Tela de Aprender
function LearnScreen({ onBack }: { onBack: () => void }) {
  const topics = [
    { title: 'Descoberta da Celula', description: 'A historia dos pioneiros da citologia', icon: '🔬', color: 'from-emerald-400 to-teal-500' },
    { title: 'Tipos de Celula', description: 'Procariontes e Eucariontes', icon: '🦠', color: 'from-blue-400 to-cyan-500' },
    { title: 'Organelas', description: 'As fabricas dentro das celulas', icon: '⚡', color: 'from-purple-400 to-pink-500' },
    { title: 'Membrana Plasmatica', description: 'A barreira protetora', icon: '🛡️', color: 'from-amber-400 to-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Aprender</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          <p className="text-muted-foreground text-center mb-6">
            Explore os conceitos de Biologia Celular
          </p>

          {topics.map((topic, i) => (
            <div 
              key={i}
              className="bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl`}>
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </div>
            </div>
          ))}

          <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 mt-6">
            <p className="text-center text-primary text-sm">
              Em breve: Mais conteudo educativo e quiz de revisao!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tela de Conquistas expandida
function AchievementsScreen({ progress, onBack }: { 
  progress: { completedPhases: number[], totalScore: number, streak: number }
  onBack: () => void 
}) {
  // Categorias de conquistas
  const achievementCategories = [
    {
      category: 'Progresso',
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      achievements: [
        { title: 'Primeira Descoberta', description: 'Complete sua primeira fase', icon: '🎯', unlocked: progress.completedPhases.length >= 1 },
        { title: 'Explorador Celular', description: 'Complete 5 fases', icon: '🔬', unlocked: progress.completedPhases.length >= 5 },
        { title: 'Cientista Iniciante', description: 'Complete 10 fases', icon: '🧪', unlocked: progress.completedPhases.length >= 10 },
        { title: 'Mestre da Citologia', description: 'Complete 15 fases', icon: '🏆', unlocked: progress.completedPhases.length >= 15 },
        { title: 'Especialista em Celulas', description: 'Complete 20 fases', icon: '🧬', unlocked: progress.completedPhases.length >= 20 },
        { title: 'Doutor em Biologia', description: 'Complete 25 fases', icon: '👨‍🔬', unlocked: progress.completedPhases.length >= 25 },
        { title: 'Derrotou o Fragmentado', description: 'Complete todas as 30 fases', icon: '👑', unlocked: progress.completedPhases.length >= 30 },
      ]
    },
    {
      category: 'Pontuação',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      achievements: [
        { title: 'Primeiros Pontos', description: 'Alcance 100 pontos', icon: '⭐', unlocked: progress.totalScore >= 100 },
        { title: 'Pontuação Crescente', description: 'Alcance 500 pontos', icon: '✨', unlocked: progress.totalScore >= 500 },
        { title: 'Pontuação Alta', description: 'Alcance 1.000 pontos', icon: '🌟', unlocked: progress.totalScore >= 1000 },
        { title: 'Super Pontuação', description: 'Alcance 2.500 pontos', icon: '💫', unlocked: progress.totalScore >= 2500 },
        { title: 'Mega Pontuação', description: 'Alcance 5.000 pontos', icon: '🎇', unlocked: progress.totalScore >= 5000 },
        { title: 'Ultra Pontuação', description: 'Alcance 10.000 pontos', icon: '🏅', unlocked: progress.totalScore >= 10000 },
        { title: 'Lenda da Pontuação', description: 'Alcance 25.000 pontos', icon: '🥇', unlocked: progress.totalScore >= 25000 },
        { title: 'Mestre Supremo', description: 'Alcance 50.000 pontos', icon: '💎', unlocked: progress.totalScore >= 50000 },
      ]
    },
    {
      category: 'Sequência',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      achievements: [
        { title: 'Primeiro Dia', description: 'Jogue pela primeira vez', icon: '🔥', unlocked: progress.streak >= 1 },
        { title: 'Sequência de 3', description: 'Jogue 3 dias seguidos', icon: '🔥', unlocked: progress.streak >= 3 },
        { title: 'Semana Dedicada', description: 'Jogue 7 dias seguidos', icon: '💪', unlocked: progress.streak >= 7 },
        { title: 'Quinzena de Fogo', description: 'Jogue 14 dias seguidos', icon: '⚡', unlocked: progress.streak >= 14 },
        { title: 'Mes Imparavel', description: 'Jogue 30 dias seguidos', icon: '🚀', unlocked: progress.streak >= 30 },
        { title: 'Dedicacao Total', description: 'Jogue 60 dias seguidos', icon: '🌋', unlocked: progress.streak >= 60 },
        { title: 'Lenda Viva', description: 'Jogue 100 dias seguidos', icon: '🏆', unlocked: progress.streak >= 100 },
      ]
    },
    {
      category: 'Blocos',
      icon: BookOpen,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      achievements: [
        { title: 'Teoria Celular', description: 'Complete o Bloco 1', icon: '📚', unlocked: progress.completedPhases.some(p => p >= 1 && p <= 3) && progress.completedPhases.filter(p => p >= 1 && p <= 3).length >= 3 },
        { title: 'Especialista em Membranas', description: 'Complete o Bloco 2', icon: '🛡️', unlocked: progress.completedPhases.filter(p => p >= 4 && p <= 6).length >= 3 },
        { title: 'Mestre das Organelas', description: 'Complete o Bloco 3', icon: '⚙️', unlocked: progress.completedPhases.filter(p => p >= 7 && p <= 9).length >= 3 },
        { title: 'Energia Celular', description: 'Complete o Bloco 4', icon: '⚡', unlocked: progress.completedPhases.filter(p => p >= 10 && p <= 12).length >= 3 },
        { title: 'Sintese Proteica', description: 'Complete o Bloco 5', icon: '🧬', unlocked: progress.completedPhases.filter(p => p >= 13 && p <= 15).length >= 3 },
        { title: 'Divisao Celular', description: 'Complete o Bloco 6', icon: '🔄', unlocked: progress.completedPhases.filter(p => p >= 16 && p <= 18).length >= 3 },
      ]
    },
    {
      category: 'Especiais',
      icon: Sparkles,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      achievements: [
        { title: 'Bem-vindo!', description: 'Comece sua jornada no CitoAprova', icon: '👋', unlocked: true },
        { title: 'Estudante Dedicado', description: 'Complete 3 fases em um dia', icon: '📖', unlocked: progress.completedPhases.length >= 3 },
        { title: 'Velocista', description: 'Alcance 1000 pontos em 5 fases', icon: '⏱️', unlocked: progress.totalScore >= 1000 && progress.completedPhases.length <= 5 },
        { title: 'Perfeccionista', description: 'Alcance 200 pontos em media por fase', icon: '💯', unlocked: progress.completedPhases.length > 0 && (progress.totalScore / progress.completedPhases.length) >= 200 },
        { title: 'Colecionador', description: 'Desbloqueie 10 conquistas', icon: '🎖️', unlocked: false }, // Será calculado abaixo
        { title: 'Veterano', description: 'Desbloqueie 20 conquistas', icon: '🎗️', unlocked: false }, // Será calculado abaixo
      ]
    }
  ]

  // Calcular total de conquistas desbloqueadas
  const allAchievements = achievementCategories.flatMap(cat => cat.achievements)
  let unlockedCount = allAchievements.filter(a => a.unlocked).length
  
  // Atualizar conquistas especiais de colecionador
  const colecionador = achievementCategories.find(c => c.category === 'Especiais')?.achievements.find(a => a.title === 'Colecionador')
  const veterano = achievementCategories.find(c => c.category === 'Especiais')?.achievements.find(a => a.title === 'Veterano')
  
  if (colecionador) colecionador.unlocked = unlockedCount >= 10
  if (veterano) veterano.unlocked = unlockedCount >= 20
  
  // Recalcular
  unlockedCount = achievementCategories.flatMap(cat => cat.achievements).filter(a => a.unlocked).length
  const totalAchievements = allAchievements.length

  const [selectedCategory, setSelectedCategory] = useState(0)

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border safe-area-top">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold">Conquistas</h1>
          <span className="ml-auto text-xs sm:text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">{unlockedCount}/{totalAchievements}</span>
        </div>
      </div>

      {/* Progresso geral */}
      <div className="px-4 py-3 border-b border-border">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="text-muted-foreground">Progresso total</span>
            <span className="font-medium">{Math.round((unlockedCount / totalAchievements) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs de categorias */}
      <div className="px-4 py-2 border-b border-border overflow-x-auto">
        <div className="max-w-lg mx-auto flex gap-2">
          {achievementCategories.map((cat, index) => {
            const CategoryIcon = cat.icon
            const catUnlocked = cat.achievements.filter(a => a.unlocked).length
            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(index)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === index
                    ? `${cat.bgColor} ${cat.color}`
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                <CategoryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{cat.category}</span>
                <span className="text-[10px] sm:text-xs opacity-70">{catUnlocked}/{cat.achievements.length}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="max-w-lg mx-auto space-y-2 sm:space-y-3">
          {achievementCategories[selectedCategory].achievements.map((achievement, i) => (
            <div 
              key={i}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border transition-all ${
                achievement.unlocked 
                  ? 'bg-card border-primary/30 shadow-sm' 
                  : 'bg-secondary/50 border-border opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                  achievement.unlocked ? 'bg-primary/20' : 'bg-secondary grayscale'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-sm sm:text-base ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Tela de Lista de Minigames
function MinigamesListScreen({ onBack }: { onBack: () => void }) {
  const minigames = [
    { name: 'Jogo da Memória', icon: '🧠', description: 'Encontre os pares de cartas correspondentes', color: 'from-blue-500 to-indigo-600' },
    { name: 'Toque Correto', icon: '👆', description: 'Toque apenas nos itens corretos que aparecem', color: 'from-green-500 to-emerald-600' },
    { name: 'Coletar Itens', icon: '🧺', description: 'Colete os itens corretos enquanto eles caem', color: 'from-amber-500 to-orange-600' },
    { name: 'Sequência', icon: '📋', description: 'Organize os eventos na ordem correta', color: 'from-purple-500 to-violet-600' },
    { name: 'Clicker', icon: '⚡', description: 'Clique rapidamente para gerar energia', color: 'from-yellow-500 to-amber-600' },
    { name: 'Quiz Arcade', icon: '❓', description: 'Responda perguntas no estilo arcade', color: 'from-cyan-500 to-blue-600' },
    { name: 'Batalha de Boss', icon: '👾', description: 'Derrote o vilão respondendo corretamente', color: 'from-red-500 to-rose-600' },
    { name: 'Desembaralhar', icon: '🔤', description: 'Desembaralhe as letras para formar palavras', color: 'from-pink-500 to-rose-600' },
    { name: 'Tempo de Reação', icon: '⏱️', description: 'Teste seus reflexos clicando no momento certo', color: 'from-teal-500 to-cyan-600' },
    { name: 'Estourar Bolhas', icon: '🫧', description: 'Estoure as bolhas com termos corretos', color: 'from-sky-500 to-blue-600' },
    { name: 'Simon Diz', icon: '🎮', description: 'Repita a sequência de cores mostrada', color: 'from-violet-500 to-purple-600' },
    { name: 'Atirador de Alvos', icon: '🎯', description: 'Acerte os alvos corretos em movimento', color: 'from-orange-500 to-red-600' },
    { name: 'Digitação', icon: '⌨️', description: 'Digite os termos científicos rapidamente', color: 'from-lime-500 to-green-600' },
    { name: 'Deslizar', icon: '👈👉', description: 'Deslize os itens para a categoria correta', color: 'from-fuchsia-500 to-pink-600' },
    { name: 'Conectar', icon: '🔗', description: 'Conecte os elementos relacionados', color: 'from-emerald-500 to-teal-600' },
    { name: 'Capturar Sequência', icon: '📦', description: 'Capture os itens na ordem correta', color: 'from-indigo-500 to-violet-600' },
    { name: 'Verdadeiro ou Falso', icon: '✅❌', description: 'Julgue rapidamente se a afirmação é verdadeira ou falsa', color: 'from-rose-500 to-red-600' },
    { name: 'Letras Caindo', icon: '🅰️', description: 'Capture as letras para formar palavras científicas', color: 'from-blue-600 to-purple-600' },
    { name: 'Classificação por Cor', icon: '🎨', description: 'Classifique os itens nas categorias corretas', color: 'from-amber-600 to-pink-600' },
    { name: 'Acerte a Toupeira', icon: '🔨', description: 'Acerte os termos corretos que aparecem nos buracos', color: 'from-orange-600 to-amber-600' },
    { name: 'Puzzle Deslizante', icon: '🧩', description: 'Organize as letras deslizando para formar a palavra', color: 'from-cyan-600 to-emerald-600' },
    { name: 'Ritmo e Toque', icon: '🎵', description: 'Toque nas letras certas no ritmo para formar respostas', color: 'from-purple-600 to-pink-600' },
  ]

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border safe-area-top">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold">Minigames</h1>
          <span className="ml-auto text-xs sm:text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">{minigames.length} jogos</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="max-w-lg mx-auto">
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Descubra todos os minigames disponíveis no CitoAprova!
          </p>

          <div className="grid grid-cols-2 gap-3">
            {minigames.map((game, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-3 border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl mb-2 shadow-sm`}>
                  {game.icon}
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1">
                  {game.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {game.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 mt-6">
            <p className="text-center text-primary text-sm">
              🎮 Os minigames aparecem aleatoriamente durante as fases!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tela de Opções com edição
function OptionsScreen({ gameConfig, onBack, onConfigUpdate }: { 
  gameConfig: GameConfig | null
  onBack: () => void 
  onConfigUpdate: (newConfig: GameConfig) => void
}) {
  const { firebaseUser, isAuthenticated } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editMode, setEditMode] = useState<'historia' | 'pratica'>(gameConfig?.mode || 'historia')
  const [editDifficulty, setEditDifficulty] = useState<'facil' | 'normal' | 'dificil'>(gameConfig?.difficulty || 'normal')
  const [editName, setEditName] = useState(gameConfig?.playerName || '')

  const handleSave = async () => {
    const newConfig: GameConfig = {
      mode: editMode,
      difficulty: editDifficulty,
      playerName: editName || 'Jogador'
    }
    
    // Save to Firebase
    if (isAuthenticated && firebaseUser) {
      try {
        await saveGameConfig(firebaseUser.uid, {
          mode: newConfig.mode,
          difficulty: newConfig.difficulty,
          playerName: newConfig.playerName,
          firstVisitComplete: true
        })
      } catch (e) {
        console.error('Error saving game config:', e)
      }
    }
    
    onConfigUpdate(newConfig)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditMode(gameConfig?.mode || 'historia')
    setEditDifficulty(gameConfig?.difficulty || 'normal')
    setEditName(gameConfig?.playerName || '')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border safe-area-top">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Opções</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <Settings className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Modo de Jogo */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              Modo de Jogo
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                <button
                  onClick={() => setEditMode('historia')}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    editMode === 'historia' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Modo Historia</div>
                  <div className="text-xs text-muted-foreground">Jornada progressiva com Boss final</div>
                </button>
                <button
                  onClick={() => setEditMode('pratica')}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    editMode === 'pratica' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Modo Pratica</div>
                  <div className="text-xs text-muted-foreground">Escolha qualquer fase livremente</div>
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Modo atual</span>
                <span className="font-medium capitalize px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {gameConfig?.mode === 'historia' ? 'Historia' : 'Pratica'}
                </span>
              </div>
            )}
          </div>

          {/* Dificuldade */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Dificuldade
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                {[
                  { id: 'facil' as const, label: 'Fácil', desc: '5 vidas, +20% tempo' },
                  { id: 'normal' as const, label: 'Normal', desc: '3 vidas, tempo padrao' },
                  { id: 'dificil' as const, label: 'Difícil', desc: '2 vidas, -20% tempo' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditDifficulty(item.id)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      editDifficulty === item.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Dificuldade atual</span>
                <span className="font-medium capitalize px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                  {gameConfig?.difficulty || 'normal'}
                </span>
              </div>
            )}
          </div>

          {/* Nome do Jogador */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Nome do Jogador
            </h3>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Digite seu nome..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none transition-colors"
              />
            ) : (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Nome atual</span>
                <span className="font-medium">{gameConfig?.playerName || 'Jogador'}</span>
              </div>
            )}
          </div>

          {/* Botoes de ação */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary"
              >
                Salvar Alteracoes
              </Button>
            </div>
          )}

          {/* Info sobre as mudanças */}
          {!isEditing && (
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground text-center">
                Clique em &quot;Editar&quot; para alterar suas configuracoes de jogo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Tela de Perfil
function ProfileScreen({ progress, playerName, onBack }: { 
  progress: { completedPhases: number[], totalScore: number, streak: number }
  playerName?: string
  onBack: () => void 
}) {
  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Perfil</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto">
          {/* Avatar e nome */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{playerName || 'Detetive'}</h2>
            <p className="text-muted-foreground">Detetive Biologico</p>
          </div>

          {/* Estatisticas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-2xl font-bold text-primary">{progress.completedPhases.length}</p>
              <p className="text-xs text-muted-foreground">Fases</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-2xl font-bold text-accent">{progress.totalScore}</p>
              <p className="text-xs text-muted-foreground">Pontos</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <p className="text-2xl font-bold text-orange-500">{progress.streak}</p>
              <p className="text-xs text-muted-foreground">Sequência</p>
            </div>
          </div>

          {/* Progresso */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-bold mb-3">Progresso Geral</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fases completadas</span>
                <span>{progress.completedPhases.length}/30</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${(progress.completedPhases.length / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tela de Ranking completa com visualização de perfis
import { RankingList } from '@/components/ranking-list'
import { getPublicProfile, type PublicProfileData } from '@/lib/firebase/firestore-service'

function RankingScreen({ onBack }: { onBack: () => void }) {
  const [viewingProfile, setViewingProfile] = useState<PublicProfileData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const handleViewProfile = async (userId: string) => {
    setLoadingProfile(true)
    try {
      const profile = await getPublicProfile(userId)
      if (profile) {
        setViewingProfile(profile)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleCloseProfile = () => {
    setViewingProfile(null)
  }

  // Visualização de perfil de outro usuário
  if (viewingProfile) {
    const achievements = [
      { title: 'Primeira Descoberta', unlocked: (viewingProfile.completedPhases?.length || 0) >= 1 },
      { title: 'Explorador Celular', unlocked: (viewingProfile.completedPhases?.length || 0) >= 5 },
      { title: 'Mestre da Citologia', unlocked: (viewingProfile.completedPhases?.length || 0) >= 15 },
      { title: 'Pontuação Alta', unlocked: viewingProfile.totalScore >= 1000 },
      { title: 'Super Pontuação', unlocked: viewingProfile.totalScore >= 5000 },
      { title: 'Sequência de 3', unlocked: viewingProfile.streak >= 3 },
      { title: 'Sequência de 7', unlocked: viewingProfile.streak >= 7 },
    ]
    const unlockedCount = achievements.filter(a => a.unlocked).length

    return (
      <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
        <div className="p-4 border-b border-border safe-area-top">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={handleCloseProfile} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold truncate">Perfil de {viewingProfile.displayName}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-8">
          <div className="max-w-lg mx-auto">
            {/* Header com avatar */}
            <div className="relative bg-gradient-to-br from-primary to-accent rounded-t-2xl h-20 sm:h-24" />
            
            <div className="bg-card border border-border border-t-0 rounded-b-2xl px-4 pb-4 -mt-2">
              {/* Avatar */}
              <div className="relative -mt-10 sm:-mt-12 mb-4 flex justify-center">
                {viewingProfile.photoURL ? (
                  <img
                    src={viewingProfile.photoURL}
                    alt=""
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-card object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-card bg-secondary flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Nome */}
              <div className="text-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{viewingProfile.displayName}</h2>
                {viewingProfile.bio && (
                  <p className="text-sm text-muted-foreground mt-1">{viewingProfile.bio}</p>
                )}
              </div>
            </div>

            {/* Estatisticas */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
              <div className="bg-card rounded-2xl p-3 sm:p-4 text-center border border-border">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-lg sm:text-xl font-bold text-foreground">{viewingProfile.totalScore.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Pontos</p>
              </div>
              <div className="bg-card rounded-2xl p-3 sm:p-4 text-center border border-border">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
                <p className="text-lg sm:text-xl font-bold text-foreground">{viewingProfile.completedPhases?.length || 0}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Fases</p>
              </div>
              <div className="bg-card rounded-2xl p-3 sm:p-4 text-center border border-border">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-lg sm:text-xl font-bold text-foreground">{viewingProfile.streak}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Sequência</p>
              </div>
            </div>

            {/* Conquistas */}
            <div className="bg-card rounded-2xl p-4 border border-border mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Conquistas
                </h3>
                <span className="text-sm text-muted-foreground">{unlockedCount}/{achievements.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      achievement.unlocked
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {achievement.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Progresso */}
            <div className="bg-card rounded-2xl p-4 border border-border mt-4">
              <h3 className="font-bold mb-3">Progresso Geral</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fases completadas</span>
                  <span>{viewingProfile.completedPhases?.length || 0}/30</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${((viewingProfile.completedPhases?.length || 0) / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border safe-area-top">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold">Ranking Global</h1>
        </div>
      </div>

      {loadingProfile && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Toque em um jogador para ver o perfil completo
          </p>
          <RankingList limit={50} showRefresh={true} onViewProfile={handleViewProfile} />
        </div>
      </div>
    </div>
  )
}

// Tela de Perfil Completa com edicao
import { Camera, Mail, Edit2, Check, X, LogOut, Shield, Image as ImageIcon } from 'lucide-react'

function ProfileScreenFull({ onBack }: { onBack: () => void }) {
  const { user, isAuthenticated, updateUser, logout, isAdmin } = useAuth()
  const progress = useGameProgress()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setEditName(user?.name || '')
    setEditBio(user?.bio || '')
    setEditPhotoPreview(user?.photoURL || null)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editName.trim() || editName.trim().length < 2) return
    
    setIsSaving(true)
    const success = await updateUser({ 
      name: editName.trim(),
      bio: editBio.trim() || undefined,
      photoURL: editPhotoPreview || undefined
    })
    setIsSaving(false)
    
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditName('')
    setEditBio('')
    setEditPhotoPreview(null)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file size to 500KB for Firestore
    if (file.size > 500 * 1024) {
      alert('A imagem deve ter no maximo 500KB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = document.createElement('img')
      img.onload = () => {
        // Resize image to max 150x150 for Firestore storage
        const canvas = document.createElement('canvas')
        const maxSize = 150
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convert to base64 with quality compression
        const base64 = canvas.toDataURL('image/jpeg', 0.7)
        
        // Check if base64 is too large (Firestore limit is ~1MB per document)
        if (base64.length > 100000) {
          // Try with lower quality
          const lowerQualityBase64 = canvas.toDataURL('image/jpeg', 0.4)
          setEditPhotoPreview(lowerQualityBase64)
        } else {
          setEditPhotoPreview(base64)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = async () => {
    await logout()
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Perfil</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">Voce nao esta logado</p>
            <p className="text-muted-foreground">Faca login para ver e editar seu perfil</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-cell-pattern flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Perfil</h1>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto">
          {/* Header com avatar */}
          <div className="relative bg-gradient-to-br from-primary to-accent rounded-t-2xl h-24" />
          
          <div className="bg-card border border-border border-t-0 rounded-b-2xl px-4 pb-4 -mt-2">
            {/* Avatar */}
            <div className="relative -mt-12 mb-4 flex justify-center">
              <div className="relative">
                {(isEditing ? editPhotoPreview : user.photoURL) ? (
                  <img
                    src={isEditing ? editPhotoPreview! : user.photoURL!}
                    alt=""
                    className="w-24 h-24 rounded-full border-4 border-card object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-card bg-secondary flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Admin badge */}
            {isAdmin && (
              <div className="flex justify-center mb-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  Administrador
                </span>
              </div>
            )}

            {/* Nome */}
            <div className="text-center mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-center text-xl font-bold bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="Seu nome"
                />
              ) : (
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              )}
            </div>

            {/* Bio */}
            <div className="mb-4">
              {isEditing ? (
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary resize-none text-sm"
                  placeholder="Escreva uma bio (opcional, max 150 caracteres)"
                />
              ) : user.bio ? (
                <p className="text-center text-muted-foreground text-sm">{user.bio}</p>
              ) : (
                <p className="text-center text-muted-foreground/50 text-sm italic">Sem bio definida</p>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>

            {/* Botoes de edicao */}
            {isEditing && (
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || editName.trim().length < 2}
                  className="flex-1 bg-primary"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Salvar
                </Button>
              </div>
            )}
          </div>

          {/* Estatisticas */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{progress.totalScore.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Pontos</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <Target className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{progress.completedPhases.length}</p>
              <p className="text-xs text-muted-foreground">Fases</p>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center border border-border">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{progress.streak}</p>
              <p className="text-xs text-muted-foreground">Sequência</p>
            </div>
          </div>

          {/* Progresso */}
          <div className="bg-card rounded-2xl p-4 border border-border mt-4">
            <h3 className="font-bold mb-3">Progresso Geral</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fases completadas</span>
                <span>{progress.completedPhases.length}/30</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${(progress.completedPhases.length / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-3 px-4 border border-destructive/30 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>

          {/* Link para painel admin */}
          {isAdmin && (
            <a
              href="/painel-de-controle-secreto"
              className="block w-full mt-3 py-3 px-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-500/20 transition-colors text-center"
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Acessar Painel Administrativo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
