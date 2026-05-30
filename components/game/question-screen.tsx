'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { Question } from '@/lib/game-types'
import { HelpCircle, Send, ArrowLeft, Lightbulb, Sparkles, Target, AlertCircle } from 'lucide-react'

interface QuestionScreenProps {
  question: Question
  onSubmit: (answer: string) => void
  onBack: () => void
}

export function QuestionScreen({ question, onSubmit, onBack }: QuestionScreenProps) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (answer.trim() && !isSubmitting) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSubmit(answer.trim())
      }, 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Gerar uma dica baseada nas palavras-chave
  const hint = `Pense sobre: ${question.keywords.slice(0, 2).join(', ')}...`
  const charCount = answer.length
  const minChars = 10

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-grid">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-4 hover:bg-secondary/50 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar a Narrativa
          </Button>

          {/* Case Info */}
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Caso {question.id}
            </span>
            <span className="text-muted-foreground text-sm">{question.theme}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow">{question.caseTitle}</h1>
        </div>

        {/* Question Card */}
        <Card className="glass p-6 mb-6 border-primary/40 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20 flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Pergunta Investigativa
              </p>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-balance">
                {question.question}
              </p>
            </div>
          </div>
        </Card>

        {/* Answer Input */}
        <Card className="glass p-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              Sua Resposta
            </label>
            <span className={`text-xs ${charCount < minChars ? 'text-muted-foreground' : 'text-primary'}`}>
              {charCount} caracteres
            </span>
          </div>
          
          <Textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta aqui... Seja claro e objetivo."
            className="min-h-[140px] resize-none bg-background/50 border-border/50 focus:border-primary/50 text-base leading-relaxed"
            disabled={isSubmitting}
          />
          
          {/* Character hint */}
          {charCount > 0 && charCount < minChars && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Tente elaborar um pouco mais sua resposta
            </p>
          )}
          
          {/* Hint Section */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="text-muted-foreground hover:text-accent gap-2 -ml-2"
            >
              <Lightbulb className={`w-4 h-4 transition-colors ${showHint ? 'text-accent' : ''}`} />
              {showHint ? 'Ocultar dica' : 'Precisa de uma dica?'}
            </Button>
            
            {showHint && (
              <div className="mt-3 p-4 rounded-xl bg-accent/10 border border-accent/30 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent mb-1">Dica do Dr. Cell</p>
                    <p className="text-sm text-accent/80">{hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
          <p className="text-xs text-muted-foreground">
            <kbd className="px-2 py-0.5 bg-secondary rounded text-xs mr-1">Ctrl</kbd>
            +
            <kbd className="px-2 py-0.5 bg-secondary rounded text-xs ml-1 mr-1">Enter</kbd>
            para enviar
          </p>
          
          <Button 
            onClick={handleSubmit} 
            disabled={answer.trim().length < minChars || isSubmitting}
            size="lg"
            className={`
              gap-2 min-w-[180px] transition-all duration-300
              ${answer.trim().length >= minChars && !isSubmitting ? 'glow-primary' : ''}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                Enviar Resposta
                <Send className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground text-center mt-6 animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
          O sistema analisa se sua resposta contem os conceitos cientificos corretos.
          Nao e necessario usar as palavras exatas.
        </p>
      </div>
    </div>
  )
}
