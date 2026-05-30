'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Question, DialogueLine } from '@/lib/game-types'
import { FlaskConical, AlertTriangle, FileText, ChevronRight, ChevronLeft, Sparkles, BookOpen, SkipForward } from 'lucide-react'

interface CaseNarrativeProps {
  question: Question
  onProceed: () => void
}

export function CaseNarrative({ question, onProceed }: CaseNarrativeProps) {
  const [step, setStep] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [history, setHistory] = useState<number[]>([])

  const dialogues = question.dialogues

  useEffect(() => {
    if (step >= dialogues.length) return

    const currentDialogue = dialogues[step]
    let index = 0
    setDisplayedText('')
    setIsTyping(true)

    const interval = setInterval(() => {
      if (index < currentDialogue.text.length) {
        setDisplayedText(currentDialogue.text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [step, dialogues])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    
    if (isTyping) {
      setDisplayedText(dialogues[step].text)
      setIsTyping(false)
    } else if (step < dialogues.length - 1) {
      setIsTransitioning(true)
      setHistory(prev => [...prev, step])
      setTimeout(() => {
        setStep(prev => prev + 1)
        setIsTransitioning(false)
      }, 100)
    } else {
      onProceed()
    }
  }, [isTyping, isTransitioning, step, dialogues, onProceed])

  const handlePrevious = useCallback(() => {
    if (isTransitioning || history.length === 0) return
    
    setIsTransitioning(true)
    const prevStep = history[history.length - 1]
    setHistory(prev => prev.slice(0, -1))
    setTimeout(() => {
      setStep(prevStep)
      setIsTransitioning(false)
    }, 100)
  }, [isTransitioning, history])

  const handleSkipTyping = useCallback(() => {
    if (isTyping) {
      setDisplayedText(dialogues[step].text)
      setIsTyping(false)
    }
  }, [isTyping, dialogues, step])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleSkipTyping()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleNext, handlePrevious, handleSkipTyping])

  if (step >= dialogues.length) return null

  const currentDialogue = dialogues[step]

  const getSpeakerConfig = (speaker: DialogueLine['speaker']) => {
    switch (speaker) {
      case 'drCell':
        return {
          icon: FlaskConical,
          name: 'Dr. Cell',
          border: 'border-primary/50 hover:border-primary',
          bg: 'bg-primary/20',
          text: 'text-primary',
          glow: 'shadow-primary/20',
          pulse: 'bg-primary'
        }
      case 'fragmento':
        return {
          icon: AlertTriangle,
          name: 'Fragmento',
          border: 'border-destructive/50 hover:border-destructive',
          bg: 'bg-destructive/20',
          text: 'text-destructive',
          glow: 'shadow-destructive/20',
          pulse: 'bg-destructive'
        }
      case 'teaching':
        return {
          icon: BookOpen,
          name: 'Conceito Importante',
          border: 'border-accent/50 hover:border-accent',
          bg: 'bg-accent/20',
          text: 'text-accent',
          glow: 'shadow-accent/20',
          pulse: 'bg-accent'
        }
      default:
        return {
          icon: FileText,
          name: 'Narrativa do Caso',
          border: 'border-muted-foreground/50 hover:border-muted-foreground',
          bg: 'bg-muted/50',
          text: 'text-muted-foreground',
          glow: 'shadow-muted/20',
          pulse: 'bg-muted-foreground'
        }
    }
  }

  const config = getSpeakerConfig(currentDialogue.speaker)
  const Icon = config.icon
  const canGoBack = history.length > 0
  const isLastStep = step === dialogues.length - 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-grid">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-dna pointer-events-none" />
      
      <div className="max-w-3xl w-full relative z-10">
        {/* Case Header */}
        <div className="text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            Caso {question.id} - {question.theme}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow text-balance">
            {question.caseTitle}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Dialogo {step + 1} de {dialogues.length}</span>
            <span>{Math.round(((step + 1) / dialogues.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((step + 1) / dialogues.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Dialogue Box */}
        <Card 
          className={`
            glass p-5 md:p-6 mb-4 cursor-pointer
            transition-all duration-200 transform
            ${isTransitioning ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}
            ${config.border} hover:shadow-lg ${config.glow}
          `}
          onClick={handleNext}
        >
          <div className="flex items-start gap-4">
            {/* Speaker Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`p-3 md:p-4 rounded-xl ${config.bg} transition-all`}>
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${config.text}`} />
              </div>
              <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${config.pulse} rounded-full animate-pulse`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-sm font-bold uppercase tracking-wider ${config.text}`}>
                  {config.name}
                </p>
                {currentDialogue.speaker === 'teaching' && (
                  <span className="text-xs bg-accent/30 text-accent px-2 py-0.5 rounded-full">
                    Anote isso!
                  </span>
                )}
              </div>
              <p className={`text-base md:text-lg leading-relaxed ${
                currentDialogue.speaker === 'teaching' 
                  ? 'bg-accent/10 p-3 rounded-lg border border-accent/30' 
                  : ''
              }`}>
                {displayedText}
                {isTyping && <span className="animate-blink ml-1 text-primary">|</span>}
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoBack || isTransitioning}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>

          {/* Step Indicators */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
              {dialogues.map((d, index) => {
                const dotConfig = getSpeakerConfig(d.speaker)
                const isActive = index === step
                const isPast = index < step
                
                return (
                  <div
                    key={index}
                    className={`
                      h-1.5 rounded-full transition-all duration-300 flex-shrink-0
                      ${isActive 
                        ? `w-6 ${dotConfig.pulse}` 
                        : isPast 
                          ? `w-1.5 ${dotConfig.pulse} opacity-50` 
                          : 'w-1.5 bg-muted'
                      }
                    `}
                    title={dotConfig.name}
                  />
                )
              })}
            </div>
          </div>

          {/* Next/Continue Button */}
          <div className="flex gap-2">
            {isTyping && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipTyping}
                className="gap-1 text-muted-foreground"
              >
                <SkipForward className="w-4 h-4" />
                Pular
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              size="sm"
              className={`
                gap-2 transition-all duration-300
                ${isLastStep && !isTyping ? 'glow-primary' : ''}
              `}
              disabled={isTransitioning}
            >
              {isLastStep && !isTyping ? (
                <>
                  Investigar
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Keyboard Hints */}
        <div className="flex justify-center mt-4 gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">←</kbd>
            Voltar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Enter</kbd>
            ou
            <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">→</kbd>
            Avancar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Esc</kbd>
            Pular animacao
          </span>
        </div>
      </div>
    </div>
  )
}
