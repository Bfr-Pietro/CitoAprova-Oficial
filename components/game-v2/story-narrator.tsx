'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { StoryDialogue, PhaseStory } from '@/lib/story-data'
import {
  ChevronRight,
  Info,
  User,
  Skull,
  Sparkles,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CharacterDisplay } from './character-display'
import { getCharacters, type CharacterData, type CharacterEmotion } from '@/lib/firebase/firestore-service'
import { AnimatePresence } from 'framer-motion'

interface StoryNarratorProps {
  story: PhaseStory
  storyType: 'introduction' | 'villainChallenge' | 'conclusion'
  onComplete: () => void
  onSkip?: () => void
}

type CharacterPosition = 'left' | 'center' | 'right'
interface SceneCharacter {
  data: CharacterData
  position: CharacterPosition
  emotion: CharacterEmotion
  isActive: boolean
}

// ── Avatar pequeno dentro da caixa de diálogo ─────────────────────────────────
const CharacterAvatar = ({ speaker }: { speaker: string }) => {
  const avatarConfig = {
    detetive:    { bg: 'from-blue-500 to-cyan-500',    icon: <User className="w-4 h-4 text-white" />,          name: 'Detetive'    },
    drCell:      { bg: 'from-emerald-500 to-teal-500', icon: <GraduationCap className="w-4 h-4 text-white" />,  name: 'Dr. Cell'    },
    fragmentado: { bg: 'from-red-600 to-purple-700',   icon: <Skull className="w-4 h-4 text-white" />,          name: 'Fragmentado' },
    narrador:    { bg: 'from-gray-600 to-gray-700',    icon: <BookOpen className="w-4 h-4 text-white" />,       name: 'Narrador'    },
    info:        { bg: 'from-amber-500 to-orange-500', icon: <Info className="w-4 h-4 text-white" />,           name: 'Informação'  },
  }
  const config = avatarConfig[speaker as keyof typeof avatarConfig] || avatarConfig.narrador
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br shadow-md flex-shrink-0', config.bg)}>
        {config.icon}
      </div>
      <span className={cn(
        'font-bold text-sm',
        speaker === 'fragmentado' ? 'text-red-400'     :
        speaker === 'drCell'      ? 'text-emerald-400' :
        speaker === 'detetive'    ? 'text-cyan-400'    : 'text-gray-300',
      )}>
        {config.name}
      </span>
    </div>
  )
}

// ── Caixa de informação educativa ─────────────────────────────────────────────
const InfoBox = ({ infoBox }: { infoBox: NonNullable<StoryDialogue['infoBox']> }) => {
  const typeConfig = {
    scientist: { bg: 'from-blue-900/80 to-indigo-900/80',  border: 'border-blue-500/50',   icon: <GraduationCap className="w-4 h-4 text-blue-400" />,  label: 'Cientista'   },
    concept:   { bg: 'from-emerald-900/80 to-teal-900/80', border: 'border-emerald-500/50', icon: <Lightbulb className="w-4 h-4 text-emerald-400" />,    label: 'Conceito'    },
    curiosity: { bg: 'from-purple-900/80 to-pink-900/80',  border: 'border-purple-500/50',  icon: <Sparkles className="w-4 h-4 text-purple-400" />,      label: 'Curiosidade' },
    important: { bg: 'from-amber-900/80 to-orange-900/80', border: 'border-amber-500/50',   icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,  label: 'Importante'  },
  }
  const config = typeConfig[infoBox.type] || typeConfig.concept
  return (
    <div className={cn('rounded-xl p-4 border-2 bg-gradient-to-br backdrop-blur-sm', config.bg, config.border)}>
      <div className="flex items-center gap-2 mb-2">
        {config.icon}
        <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">{config.label}</span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{infoBox.title}</h3>
      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{infoBox.content}</p>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export function StoryNarrator({ story, storyType, onComplete, onSkip }: StoryNarratorProps) {
  const [currentIndex, setCurrentIndex]       = useState(0)
  const [displayedText, setDisplayedText]     = useState('')
  const [isTyping, setIsTyping]               = useState(true)
  const [characters, setCharacters]           = useState<CharacterData[]>([])
  const [charactersLoaded, setCharactersLoaded] = useState(false)
  const [sceneCharacters, setSceneCharacters] = useState<SceneCharacter[]>([])

  const dialogues       = story[storyType] || []
  const currentDialogue = dialogues[currentIndex]

  // Carrega personagens do Firebase uma vez
  useEffect(() => {
    const load = async () => {
      try { setCharacters(await getCharacters()) }
      catch (e) { console.error('Error loading characters:', e) }
      finally { setCharactersLoaded(true) }
    }
    load()
  }, [])

  // Mapeia speaker → posição na cena
  const getSpeakerPosition = useCallback((speaker: string): CharacterPosition => {
    if (speaker === 'detetive')    return 'left'
    if (speaker === 'fragmentado') return 'right'
    return 'center' // drCell e qualquer outro
  }, [])

  // Atualiza cena de personagens a cada diálogo
  useEffect(() => {
    if (!charactersLoaded || !currentDialogue) return
    const speaker = currentDialogue.speaker
    const emotion = (currentDialogue.emotion as CharacterEmotion) || 'neutral'

    // Narrador / info: mantém personagens na tela mas todos inativos
    if (speaker === 'narrador' || speaker === 'info') {
      setSceneCharacters(prev => prev.map(c => ({ ...c, isActive: false })))
      return
    }

    const characterData = characters.find(c => c.id === speaker)
    if (!characterData) return

    const position = getSpeakerPosition(speaker)

    setSceneCharacters(prev => {
      const existingIndex = prev.findIndex(c => c.data.id === characterData.id)
      if (existingIndex >= 0) {
        // Personagem já está na cena: atualiza emoção e ativa
        return prev.map((c, i) => ({
          ...c,
          emotion:  i === existingIndex ? emotion : c.emotion,
          isActive: i === existingIndex,
        }))
      }
      // Novo personagem: mantém apenas o último já presente + adiciona o novo
      const trimmed = prev.map(c => ({ ...c, isActive: false })).slice(-1)
      return [...trimmed, { data: characterData, position, emotion, isActive: true }]
    })
  }, [currentDialogue, characters, charactersLoaded, getSpeakerPosition])

  // Efeito de digitação
  useEffect(() => {
    if (!currentDialogue || currentDialogue.speaker === 'info') {
      setIsTyping(false)
      setDisplayedText(currentDialogue?.text || '')
      return
    }
    setIsTyping(true)
    setDisplayedText('')
    let i = 0
    const text  = currentDialogue.text
    const timer = setInterval(() => {
      if (i < text.length) setDisplayedText(text.slice(0, ++i))
      else { setIsTyping(false); clearInterval(timer) }
    }, 20)
    return () => clearInterval(timer)
  }, [currentDialogue, currentIndex])

  // Avança diálogo
  const handleNext = useCallback(() => {
    if (isTyping) {
      setIsTyping(false)
      setDisplayedText(currentDialogue?.text || '')
      return
    }
    if (currentIndex < dialogues.length - 1) setCurrentIndex(p => p + 1)
    else onComplete()
  }, [isTyping, currentIndex, dialogues.length, currentDialogue, onComplete])

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['Enter', ' ', 'ArrowRight'].includes(e.key)) { e.preventDefault(); handleNext() }
      if (e.key === 'Escape' && onSkip) onSkip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, onSkip])

  // Sem diálogos → completa imediatamente
  useEffect(() => {
    if (!dialogues || dialogues.length === 0 || !currentDialogue) onComplete()
  }, [dialogues, currentDialogue, onComplete])

  // Loading state
  if (!currentDialogue || dialogues.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-sm">Carregando...</p>
      </div>
    )
  }

  // ── Derivações ──────────────────────────────────────────────────────────────
  const isInfo    = currentDialogue.speaker === 'info' && !!currentDialogue.infoBox
  const showChars = !isInfo && charactersLoaded && sceneCharacters.some(c => c.isActive)
  const progress  = ((currentIndex + 1) / dialogues.length) * 100

  const dialogBorderColor =
    currentDialogue.speaker === 'fragmentado' ? 'border-red-500/40'     :
    currentDialogue.speaker === 'drCell'      ? 'border-emerald-500/40' :
    currentDialogue.speaker === 'detetive'    ? 'border-cyan-500/40'    :
    'border-white/10'

  const bgOverlayColor =
    currentDialogue.speaker === 'fragmentado' ? 'from-red-950/50'     :
    currentDialogue.speaker === 'drCell'      ? 'from-emerald-950/50' :
    currentDialogue.speaker === 'detetive'    ? 'from-blue-950/50'    :
    'from-slate-900/80'

  // ── Render ──────────────────────────────────────────────────────────────────
  //
  // Layout (de cima para baixo, sem scroll):
  //
  //  ┌─────────────────────────────────┐  flex-shrink-0
  //  │  Header: título + barra progresso│
  //  ├─────────────────────────────────┤
  //  │                                 │
  //  │  Área de personagens (flex-1)   │  posição relativa, personagens absolute
  //  │                                 │
  //  ├─────────────────────────────────┤  flex-shrink-0
  //  │  Caixa de diálogo               │
  //  ├─────────────────────────────────┤  flex-shrink-0
  //  │  Botões Pular / Próximo         │
  //  └─────────────────────────────────┘
  //
  // Os personagens ficam na área do meio e nunca sobrepõem
  // a caixa de diálogo nem os botões.

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">

      {/* ── 1. Header: título + barra de progresso ── */}
      <div className="flex-shrink-0 px-4 pt-safe-top pt-3 pb-2 border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate pr-2">{story.title}</h1>
            <span className="text-[10px] text-gray-400 flex-shrink-0">{currentIndex + 1}/{dialogues.length}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 2. Área dos personagens (flex-1 = ocupa todo espaço restante acima do diálogo) ── */}
      <div className="flex-1 min-h-0 relative overflow-hidden">

        {/* Gradiente de fundo decorativo */}
        {showChars && (
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t via-transparent to-transparent pointer-events-none z-0',
            bgOverlayColor,
          )} />
        )}

        {/* Personagens — absolute bottom-0, height 100% do pai */}
        {showChars && (
          <AnimatePresence mode="sync">
            {sceneCharacters.map(sc => (
              <CharacterDisplay
                key={sc.data.id}
                character={sc.data}
                emotion={sc.emotion}
                position={sc.position}
                isActive={sc.isActive}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Sem personagens ativos: texto centralizado no meio da tela */}
        {!showChars && !isInfo && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
              <div className={cn('bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 border shadow-xl', dialogBorderColor)}>
                <CharacterAvatar speaker={currentDialogue.speaker} />
                <p className={cn(
                  'text-sm sm:text-base text-gray-100 leading-relaxed',
                  currentDialogue.speaker === 'narrador' && 'italic text-gray-300',
                )}>
                  {displayedText}
                  {isTyping && <span className="animate-pulse ml-0.5">|</span>}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* InfoBox centralizada */}
        {isInfo && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
              <InfoBox infoBox={currentDialogue.infoBox!} />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Caixa de diálogo — visível SOMENTE quando há personagens na tela ── */}
      {showChars && (
        <div className="flex-shrink-0 px-4 pt-3 pb-2 bg-gradient-to-t from-slate-900 to-slate-900/95">
          <div className="max-w-2xl mx-auto">
            <div className={cn('bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border shadow-xl', dialogBorderColor)}>
              <CharacterAvatar speaker={currentDialogue.speaker} />
              <p className={cn(
                'text-sm sm:text-base text-gray-100 leading-relaxed',
                currentDialogue.speaker === 'narrador' && 'italic text-gray-300',
              )}>
                {displayedText}
                {isTyping && <span className="animate-pulse ml-0.5">|</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Botões — sempre fixos no rodapé ── */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/10 bg-slate-900 pb-safe-bottom">
        <div className="max-w-2xl mx-auto flex gap-3">
          {onSkip && (
            <Button
              onClick={onSkip}
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-white/30 bg-slate-700 text-white hover:bg-slate-600 hover:text-white text-xs font-semibold px-4 h-11"
            >
              Pular
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={cn(
              'flex-1 h-11 text-sm font-bold rounded-xl shadow-lg',
              storyType === 'villainChallenge'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600',
            )}
          >
            {isTyping
              ? 'Continuar'
              : currentIndex < dialogues.length - 1
                ? <><span>Próximo</span><ChevronRight className="w-4 h-4 ml-1" /></>
                : storyType === 'villainChallenge'
                  ? <><span>Aceitar Desafio!</span><Sparkles className="w-4 h-4 ml-1" /></>
                  : storyType === 'conclusion'
                    ? 'Continuar'
                    : 'Começar'
            }
          </Button>
        </div>
        <p className="text-center text-[9px] text-gray-500 mt-1.5">
          Pressione Enter ou Espaço para continuar
        </p>
      </div>

    </div>
  )
}
