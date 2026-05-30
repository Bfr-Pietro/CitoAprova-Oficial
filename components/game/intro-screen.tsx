'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FlaskConical, AlertTriangle, User, ChevronRight, Dna, Microscope, Atom } from 'lucide-react'

interface IntroScreenProps {
  onStart: () => void
  hasProgress: boolean
}

const dialogues = [
  {
    speaker: 'drCell',
    text: 'Detetive... se voce esta vendo esta mensagem, significa que o sistema do laboratorio foi comprometido.',
    icon: FlaskConical
  },
  {
    speaker: 'drCell',
    text: 'Um virus chamado Fragmento corrompeu parte da nossa base de conhecimento cientifico.',
    icon: FlaskConical
  },
  {
    speaker: 'drCell',
    text: 'Arquivos importantes sobre citologia desapareceram. Sem eles, nosso sistema ficara incompleto.',
    icon: FlaskConical
  },
  {
    speaker: 'fragmento',
    text: 'Interessante... entao enviaram um detetive? Vamos ver se voce realmente entende de biologia.',
    icon: AlertTriangle
  },
  {
    speaker: 'fragmento',
    text: 'Cada erro seu vai destruir mais um arquivo cientifico. Hahaha!',
    icon: AlertTriangle
  },
  {
    speaker: 'drCell',
    text: 'Nao de ouvidos a ele, Detetive. Recupere os fragmentos do conhecimento. A primeira sala esta liberada.',
    icon: FlaskConical
  }
]



function DNAHelix() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -left-20 top-1/4 opacity-10">
        <Dna 
          className="w-40 h-40 text-primary"
          style={{ animation: 'float 6s ease-in-out 0s infinite' }}
        />
      </div>
      <div className="absolute -right-10 top-1/2 opacity-10">
        <Atom 
          className="w-32 h-32 text-accent"
          style={{ animation: 'float 6s ease-in-out 1s infinite' }}
        />
      </div>
      <div className="absolute left-1/4 -bottom-10 opacity-10">
        <Microscope 
          className="w-24 h-24 text-primary"
          style={{ animation: 'float 6s ease-in-out 2s infinite' }}
        />
      </div>
    </div>
  )
}

export function IntroScreen({ onStart, hasProgress }: IntroScreenProps) {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showStart, setShowStart] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (currentDialogue >= dialogues.length) {
      setShowStart(true)
      return
    }

    const text = dialogues[currentDialogue].text
    let index = 0
    setDisplayedText('')
    setIsTyping(true)

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [currentDialogue])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    
    if (isTyping) {
      setDisplayedText(dialogues[currentDialogue].text)
      setIsTyping(false)
    } else if (currentDialogue < dialogues.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentDialogue(prev => prev + 1)
        setIsTransitioning(false)
      }, 150)
    } else {
      setShowStart(true)
    }
  }, [isTyping, isTransitioning, currentDialogue])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleNext])

  const currentSpeaker = currentDialogue < dialogues.length ? dialogues[currentDialogue] : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-grid">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-dna" />
      <DNAHelix />
      
      
      
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-primary/10 animate-scan-line" />
      </div>
      
      <div className="relative z-10 max-w-2xl w-full">
        {/* Title */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <FlaskConical className="w-14 h-14 md:w-16 md:h-16 text-primary" />
              <div className="absolute inset-0 animate-pulse-glow rounded-full" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">
                Detetive Biologico
              </h1>
              <p className="text-primary/80 text-sm md:text-base tracking-widest uppercase mt-1">
                Laboratorio Central de Citologia
              </p>
            </div>
          </div>
        </div>

        {/* Dialogue Box */}
        {!showStart && currentSpeaker && (
          <div 
            className={`
              glass rounded-xl p-6 mb-6 cursor-pointer
              transition-all duration-300 transform
              ${isTransitioning ? 'opacity-50 scale-98' : 'opacity-100 scale-100'}
              ${currentSpeaker.speaker === 'drCell' 
                ? 'border-primary/50 hover:border-primary hover:glow-primary' 
                : 'border-destructive/50 hover:border-destructive hover:glow-destructive'
              }
            `}
            onClick={handleNext}
          >
            <div className="flex items-start gap-4">
              <div className={`
                relative p-4 rounded-xl flex-shrink-0
                ${currentSpeaker.speaker === 'drCell' 
                  ? 'bg-primary/20' 
                  : 'bg-destructive/20'
                }
              `}>
                <currentSpeaker.icon className={`
                  w-8 h-8
                  ${currentSpeaker.speaker === 'drCell' 
                    ? 'text-primary' 
                    : 'text-destructive'
                  }
                `} />
                {currentSpeaker.speaker === 'drCell' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm font-bold mb-2 uppercase tracking-wider
                  ${currentSpeaker.speaker === 'drCell' 
                    ? 'text-primary text-glow' 
                    : 'text-destructive text-glow-destructive'
                  }
                `}>
                  {currentSpeaker.speaker === 'drCell' ? 'Dr. Cell' : 'Fragmento'}
                </p>
                <p className="text-foreground text-lg leading-relaxed font-medium">
                  {displayedText}
                  {isTyping && <span className="animate-blink ml-1 text-primary">|</span>}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-2 group">
                <kbd className="px-2 py-1 bg-secondary rounded text-xs">Enter</kbd>
                ou clique para continuar 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        )}

        {/* Start Buttons */}
        {showStart && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass rounded-xl p-8 text-center border border-primary/30">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <User className="w-20 h-20 text-primary" />
                <div className="absolute inset-0 rounded-full animate-pulse-glow" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-glow">Voce e o Detetive Biologico</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Sua missao e investigar os arquivos corrompidos e restaurar o conhecimento cientifico 
                resolvendo casos biologicos em 9 salas do laboratorio.
              </p>

              <div className="space-y-3 max-w-xs mx-auto">
                <Button 
                  size="lg" 
                  onClick={onStart} 
                  className="w-full h-14 text-lg font-bold gap-3 glow-primary hover:scale-105 transition-transform"
                >
                  <Microscope className="w-5 h-5" />
                  {hasProgress ? 'Continuar Investigacao' : 'Iniciar Investigacao'}
                </Button>
                {hasProgress && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={onStart} 
                    className="w-full h-12 hover:bg-secondary/50"
                  >
                    Comecar do Zero
                  </Button>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  30 casos | 9 salas | Prepare-se para o ENEM
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {!showStart && (
          <div className="flex justify-center gap-2 animate-in fade-in duration-500">
            {dialogues.map((d, index) => (
              <div 
                key={index}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index === currentDialogue 
                    ? d.speaker === 'drCell' 
                      ? 'w-8 bg-primary glow-primary' 
                      : 'w-8 bg-destructive glow-destructive'
                    : index < currentDialogue 
                      ? 'w-2 bg-primary/50' 
                      : 'w-2 bg-muted'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
