'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, BookOpen, Trophy, Sparkles, Dna, FlaskConical, Zap, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { usePageTransition } from '@/contexts/transition-context'
import { ReviewsCarousel } from '@/components/reviews-carousel'

// Celula animada flutuante
function FloatingCell({ delay = 0, size = 120, className = '' }: { delay?: number; size?: number; className?: string }) {
  return (
    <div 
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ 
        width: size, 
        height: size,
        animation: `float 6s ease-in-out infinite ${delay}s`,
        background: 'radial-gradient(circle at 30% 30%, oklch(0.55 0.20 160 / 0.15) 0%, oklch(0.85 0.08 140 / 0.2) 40%, oklch(0.65 0.15 60 / 0.1) 100%)'
      }}
    >
      {/* Nucleo */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '35%',
          height: '35%',
          top: '25%',
          left: '30%',
          background: 'radial-gradient(circle, oklch(0.55 0.18 280 / 0.4) 0%, transparent 70%)'
        }}
      />
      {/* Mitocondria */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '15%',
          height: '10%',
          top: '60%',
          left: '55%',
          background: 'oklch(0.60 0.20 25 / 0.4)',
          borderRadius: '50%'
        }}
      />
    </div>
  )
}

// Feature card
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <article className="group relative bg-card/80 backdrop-blur-sm border-2 border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
    </article>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { navigateTo } = usePageTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Pular para o conteúdo principal
      </a>
      
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-cell-pattern" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-cell opacity-50" aria-hidden="true" />
      
      {/* Celulas flutuantes - hidden on very small screens */}
      {mounted && (
        <>
          <FloatingCell delay={0} size={120} className="top-[10%] left-[5%] opacity-60 hidden sm:block" />
          <FloatingCell delay={1.5} size={80} className="top-[20%] right-[10%] opacity-40 hidden sm:block" />
          <FloatingCell delay={3} size={70} className="bottom-[30%] left-[15%] opacity-50" />
          <FloatingCell delay={2} size={100} className="bottom-[10%] right-[5%] opacity-30" />
          <FloatingCell delay={4} size={60} className="top-[50%] left-[50%] opacity-40 hidden sm:block" />
        </>
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 md:px-12" role="banner">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="CitoAprova"
            width={140}
            height={44}
            className="h-auto w-[100px] sm:w-[120px] md:w-[140px]"
          />
        </div>
        
        {/* Mobile Auth Button */}
        <div className="flex md:hidden items-center gap-2">
          {!isLoading && (
            isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground font-medium truncate max-w-[80px]">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                Entrar
              </Link>
            )
          )}
        </div>

        <nav className="hidden md:flex items-center gap-6" aria-label="Navegacao principal">
          <Link 
            href="#recursos" 
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
          >
            Recursos
          </Link>
          <Link 
            href="#como-funciona" 
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
          >
            Como Funciona
          </Link>
          {!isLoading && (
            isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground font-medium">
                  Olá, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Sair</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                Entrar
              </Link>
            )
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="main-content" className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-24 md:pt-24 md:pb-32 text-center" aria-labelledby="hero-title">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8" role="status">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">Aprenda Citologia de forma divertida</span>
          </div>

          {/* Titulo */}
          <h1 id="hero-title" className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-4 sm:mb-6 leading-tight text-balance">
            Domine a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              Biologia Celular
            </span>
            <br />
            Jogando
          </h1>

          {/* Subtitulo */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed text-pretty px-2">
            Um jogo educativo interativo que transforma o estudo de citologia em uma aventura emocionante. 
            Perfeito para estudantes do Ensino Médio e vestibulares.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0" role="group" aria-label="Acoes principais">
            <button
              onClick={() => navigateTo('/criar')}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
              Comecar a Jogar
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </button>
            <Link 
              href="#recursos"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-base sm:text-lg border-2 border-border bg-card/50 backdrop-blur-sm hover:border-primary hover:bg-card transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              Saiba Mais
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap justify-center gap-8 mt-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-foreground">9+</p>
            <p className="text-sm text-muted-foreground">Fases</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-foreground">50+</p>
            <p className="text-sm text-muted-foreground">Minigames</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-foreground">100%</p>
            <p className="text-sm text-muted-foreground">Gratuito</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 md:py-28" aria-labelledby="recursos-title">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 id="recursos-title" className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 sm:mb-4">
              Aprenda de Verdade
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
              Combinamos ciencia educacional com game design para criar a melhor experiencia de aprendizado.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <FeatureCard 
              icon={FlaskConical}
              title="Conteúdo Completo"
              description="Todo o conteúdo de citologia do Ensino Médio, das organelas à divisão celular."
            />
            <FeatureCard 
              icon={Zap}
              title="Minigames Variados"
              description="Quiz, memória, sequência, coleta e muito mais para testar seu conhecimento."
            />
            <FeatureCard 
              icon={Trophy}
              title="Sistema de Pontos"
              description="Ganhe pontos, desbloqueie fases e acompanhe o seu progresso."
            />
            <FeatureCard 
              icon={Dna}
              title="Boss Final"
              description="Enfrente o desafio final testando tudo o que você aprendeu."
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="como-funciona" className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 md:py-28 bg-secondary/30" aria-labelledby="como-funciona-title">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 id="como-funciona-title" className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 sm:mb-4">
              Como Funciona
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Em apenas 3 passos voce comeca sua jornada pelo mundo celular.
            </p>
          </div>

          <ol className="space-y-6 sm:space-y-8" role="list" aria-label="Passos para comecar">
            {[
              { step: '01', title: 'Escolha seu modo', description: 'Selecione entre modo historia ou pratica livre para comecar.' },
              { step: '02', title: 'Jogue os minigames', description: 'Complete desafios interativos e aprenda sobre cada tema.' },
              { step: '03', title: 'Derrote o Boss', description: 'Teste todo o seu conhecimento no desafio final.' }
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 sm:gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg sm:text-2xl font-black text-primary-foreground group-hover:scale-110 transition-transform" aria-hidden="true">
                  {item.step}
                </div>
                <div className="pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
                    <span className="sr-only">Passo {index + 1}: </span>
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsCarousel />

      {/* CTA Final */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-4 sm:mb-6">
            Pronto para comecar?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 px-4">
            Junte-se a milhares de estudantes que ja estao aprendendo citologia de forma divertida.
          </p>
          <button
            onClick={() => navigateTo('/criar')}
            className="group inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            Jogar Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-6 sm:py-8 border-t border-border safe-area-bottom" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="CitoAprova"
              width={100}
              height={32}
              className="h-auto w-[80px] sm:w-[100px]"
            />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Feito com carinho para estudantes de biologia
          </p>
        </div>
      </footer>
    </main>
  )
}
