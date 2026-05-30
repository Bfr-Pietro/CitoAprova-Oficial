'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import { usePageTransition } from '@/contexts/transition-context'
import { getGameConfig, saveGameConfig } from '@/lib/firebase/firestore-service'
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  BookOpen, 
  Zap, 
  Target,
  Heart,
  Sparkles,
  Check,
  Loader2
} from 'lucide-react'

type GameMode = 'historia' | 'pratica' | null
type Difficulty = 'facil' | 'normal' | 'dificil' | null

export default function CriarJogo() {
  const { navigateTo } = usePageTransition()
  const { user, firebaseUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>(null)
  const [playerName, setPlayerName] = useState('')
  const [isCheckingConfig, setIsCheckingConfig] = useState(true)

  // Verificar se usuario logado ja tem config salva - redirecionar direto para o jogo
  useEffect(() => {
    // Esperar autenticação carregar
    if (authLoading) return
    
    const checkExistingConfig = async () => {
      // Se está logado, verificar config no Firebase
      if (isAuthenticated && firebaseUser) {
        try {
          const savedConfig = await getGameConfig(firebaseUser.uid)
          
          // Se já completou primeira visita, ir direto para o jogo
          if (savedConfig && savedConfig.firstVisitComplete) {
            navigateTo('/jogar')
            return
          }
          
          // Se tem config salva mas não completou, carregar valores
          if (savedConfig) {
            setGameMode(savedConfig.mode || null)
            setDifficulty(savedConfig.difficulty || null)
            setPlayerName(savedConfig.playerName || '')
          }
        } catch (e) {
          console.error('Error loading game config:', e)
        }
      }
      
      setIsCheckingConfig(false)
    }
    
    checkExistingConfig()
  }, [isAuthenticated, firebaseUser, authLoading, navigateTo])

  // Pre-preencher nome se usuario estiver logado
  useEffect(() => {
    if (isAuthenticated && user?.name && !playerName) {
      setPlayerName(user.name)
    }
  }, [isAuthenticated, user, playerName])

  const handleStartGame = async () => {
    // Salvar configuracoes no Firebase
    if (isAuthenticated && firebaseUser) {
      try {
        await saveGameConfig(firebaseUser.uid, {
          mode: gameMode as 'historia' | 'pratica',
          difficulty: difficulty as 'facil' | 'normal' | 'dificil',
          playerName: playerName || 'Jogador',
          firstVisitComplete: true
        })
      } catch (e) {
        console.error('Error saving game config:', e)
      }
    }
    navigateTo('/jogar')
  }

  const canProceed = () => {
    if (step === 1) return gameMode !== null
    if (step === 2) return difficulty !== null
    if (step === 3) return true
    return false
  }

  // Tela de loading enquanto verifica configuração
  if (authLoading || isCheckingConfig) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="absolute inset-0 bg-cell-pattern" aria-hidden="true" />
        <div className="relative z-10 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Pular para o conteúdo principal
      </a>
      
      {/* Background */}
      <div className="absolute inset-0 bg-cell-pattern" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-cell opacity-30" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12" role="banner">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Voltar</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="CitoAprova"
            width={140}
            height={44}
            className="h-auto w-[120px] md:w-[140px]"
          />
        </div>
        {!isAuthenticated ? (
          <Link 
            href="/auth"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-sm font-medium"
          >
            Entrar
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Logado como</span>
            <span className="font-medium text-foreground">{user?.name}</span>
          </div>
        )}
      </header>

      {/* Progress Steps */}
      <nav className="relative z-10 flex justify-center px-6 py-8" aria-label="Progresso do cadastro">
        <ol className="flex items-center gap-4" role="list">
          {[
            { num: 1, label: 'Modo de jogo' },
            { num: 2, label: 'Dificuldade' },
            { num: 3, label: 'Confirmação' }
          ].map((s) => (
            <li key={s.num} className="flex items-center gap-4">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${s.num < step ? 'bg-primary text-primary-foreground' : ''}
                  ${s.num === step ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground scale-110 shadow-lg' : ''}
                  ${s.num > step ? 'bg-muted text-muted-foreground' : ''}
                `}
                aria-current={s.num === step ? 'step' : undefined}
                aria-label={`${s.label}${s.num < step ? ' - concluído' : s.num === step ? ' - atual' : ''}`}
              >
                {s.num < step ? <Check className="w-5 h-5" aria-hidden="true" /> : s.num}
              </div>
              {s.num < 3 && (
                <div className={`w-12 h-1 rounded-full transition-colors ${s.num < step ? 'bg-primary' : 'bg-muted'}`} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div id="main-content" className="relative z-10 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-2xl">
          
          {/* Step 1: Modo de Jogo */}
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  Escolha o Modo de Jogo
                </h1>
                <p className="text-muted-foreground">
                  Selecione como você quer aprender citologia
                </p>
              </div>

              <div className="grid gap-4" role="radiogroup" aria-label="Selecione o modo de jogo">
                <button
                  onClick={() => setGameMode('historia')}
                  role="radio"
                  aria-checked={gameMode === 'historia'}
                  className={`
                    relative p-6 rounded-2xl border-2 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${gameMode === 'historia' 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${gameMode === 'historia' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                    `} aria-hidden="true">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">Modo História</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Siga uma jornada progressiva através de todos os tópicos de citologia. 
                        Desbloqueie fases e enfrente o Boss final.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">9 Fases</span>
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">Boss Final</span>
                        <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Progresso Salvo</span>
                      </div>
                    </div>
                  </div>
                  {gameMode === 'historia' && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setGameMode('pratica')}
                  role="radio"
                  aria-checked={gameMode === 'pratica'}
                  className={`
                    relative p-6 rounded-2xl border-2 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${gameMode === 'pratica' 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${gameMode === 'pratica' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                    `} aria-hidden="true">
                      <Target className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">Modo Prática</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Escolha qualquer fase para praticar. Perfeito para revisar tópicos específicos 
                        antes de provas.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Acesso Livre</span>
                        <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Sem Pressão</span>
                      </div>
                    </div>
                  </div>
                  {gameMode === 'pratica' && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Dificuldade */}
          {step === 2 && (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  Selecione a Dificuldade
                </h1>
                <p className="text-muted-foreground">
                  Escolha o nível de desafio que combina com você
                </p>
              </div>

              <div className="grid gap-4" role="radiogroup" aria-label="Selecione a dificuldade">
                {[
                  { 
                    id: 'facil' as Difficulty, 
                    title: 'Fácil', 
                    icon: Heart,
                    description: 'Mais tempo, mais vidas e dicas extras para iniciantes.',
                    details: ['5 vidas', '90s por minigame', 'Dicas visuais']
                  },
                  { 
                    id: 'normal' as Difficulty, 
                    title: 'Normal', 
                    icon: Zap,
                    description: 'Equilíbrio perfeito entre desafio e aprendizado.',
                    details: ['3 vidas', '60s por minigame', 'Padrão']
                  },
                  { 
                    id: 'dificil' as Difficulty, 
                    title: 'Difícil', 
                    icon: Target,
                    description: 'Para quem quer testar seus limites. Sem piedade!',
                    details: ['2 vidas', '45s por minigame', 'Sem dicas']
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDifficulty(item.id)}
                    role="radio"
                    aria-checked={difficulty === item.id}
                    className={`
                      relative p-6 rounded-2xl border-2 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                      ${difficulty === item.id 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                        ${difficulty === item.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                      `} aria-hidden="true">
                        <item.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.details.map((detail, i) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {difficulty === item.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Nome e Confirmacao */}
          {step === 3 && (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  Quase la!
                </h1>
                <p className="text-muted-foreground">
                  Digite seu nome e prepare-se para a aventura
                </p>
              </div>

              <div className="bg-card border-2 border-border rounded-2xl p-6 mb-8">
                <label htmlFor="player-name" className="block text-sm font-medium text-foreground mb-2">
                  Seu nome (opcional)
                </label>
                <input
                  type="text"
                  id="player-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Digite seu nome..."
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground placeholder:text-muted-foreground"
                  maxLength={20}
                  aria-describedby="name-hint"
                />
                <p id="name-hint" className="sr-only">O nome sera exibido durante o jogo</p>
              </div>

              {/* Resumo */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-8" role="region" aria-labelledby="resumo-title">
                <h3 id="resumo-title" className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                  Resumo do Jogo
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Modo:</span>
                    <span className="font-medium text-foreground">
                      {gameMode === 'historia' ? 'Historia' : 'Pratica'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dificuldade:</span>
                    <span className="font-medium text-foreground capitalize">
                      {difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Jogador:</span>
                    <span className="font-medium text-foreground">
                      {playerName || 'Jogador'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center justify-between mt-10" aria-label="Navegacao do formulario">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              aria-label="Voltar para o passo anterior"
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${step === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}
              `}
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Voltar
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                aria-label={canProceed() ? 'Continuar para o proximo passo' : 'Selecione uma opcao para continuar'}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                  ${canProceed()
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:scale-105'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'}
                `}
              >
                Continuar
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={handleStartGame}
                aria-label="Iniciar o jogo com as configuracoes selecionadas"
                className="flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Play className="w-6 h-6" aria-hidden="true" />
                Iniciar Jogo
              </button>
            )}
          </nav>
        </div>
      </div>
    </main>
  )
}
