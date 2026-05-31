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
  GraduationCap
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

const CharacterAvatar = ({ speaker }: { speaker: string }) => {
  const avatarConfig = {
    detetive: {
      bg: 'from-blue-500 to-cyan-500',
      icon: <User className="w-4 h-4 text-white" />,
      name: 'Detetive'
    },
    drCell: {
      bg: 'from-emerald-500 to-teal-500',
      icon: <GraduationCap className="w-4 h-4 text-white" />,
      name: 'Dr. Cell'
    },
    fragmentado: {
      bg: 'from-red-600 to-purple-700',
      icon: <Skull className="w-4 h-4 text-white" />,
      name: 'Fragmentado'
    },
    narrador: {
      bg: 'from-gray-600 to-gray-700',
      icon: <BookOpen className="w-4 h-4 text-white" />,
      name: 'Narrador'
    },
    info: {
      bg: 'from-amber-500 to-orange-500',
      icon: <Info className="w-4 h-4 text-white" />,
      name: 'Informacao'
    }
  }

  const config = avatarConfig[speaker as keyof typeof avatarConfig] || avatarConfig.narrador

  return (
    <div className="flex items-center gap-2 mb-2">
      <div className={cn(
        "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg flex-shrink-0",
        config.bg
      )}>
        {config.icon}
      </div>
      <span className={cn(
        "font-bold text-sm truncate",
        speaker === 'fragmentado' ? 'text-red-400' : 
        speaker === 'drCell' ? 'text-emerald-400' :
        speaker === 'detetive' ? 'text-cyan-400' :
        'text-gray-300'
      )}>
        {config.name}
      </span>
    </div>
  )
}

const InfoBox = ({ infoBox }: { infoBox: NonNullable<StoryDialogue['infoBox']> }) => {
  const typeConfig = {
    scientist: {
      bg: 'from-blue-900/80 to-indigo-900/80',
      border: 'border-blue-500/50',
      icon: <GraduationCap className="w-4 h-4 text-blue-400" />,
      label: 'Cientista'
    },
    concept: {
      bg: 'from-emerald-900/80 to-teal-900/80',
      border: 'border-emerald-500/50',
      icon: <Lightbulb className="w-4 h-4 text-emerald-400" />,
      label: 'Conceito'
    },
    curiosity: {
      bg: 'from-purple-900/80 to-pink-900/80',
      border: 'border-purple-500/50',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      label: 'Curiosidade'
    },
    important: {
      bg: 'from-amber-900/80 to-orange-900/80',
      border: 'border-amber-500/50',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      label: 'Importante'
    }
  }

  const config = typeConfig[infoBox.type] || typeConfig.concept

  return (
    <div className={cn(
      "rounded-xl p-3 sm:p-4 border-2 bg-gradient-to-br backdrop-blur-sm",
      config.bg,
      config.border
    )}>
      <div className="flex items-center gap-2 mb-2">
        {config.icon}
        <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">
          {config.label}
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{infoBox.title}</h3>
      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{infoBox.content}</p>
    </div>
  )
}

export function StoryNarrator({ story, storyType, onComplete, onSkip }: StoryNarratorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [charactersLoaded, setCharactersLoaded] = useState(false)
  const [sceneCharacters, setSceneCharacters] = useState<SceneCharacter[]>([])

  const dialogues = story[storyType] || []
  const currentDialogue = dialogues[currentIndex]

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await getCharacters()
        setCharacters(data)
      } catch (error) {
        console.error('Error loading characters:', error)
      } finally {
        setCharactersLoaded(true)
      }
    }
    loadCharacters()
  }, [])

  const getSpeakerPosition = useCallback((speaker: string): CharacterPosition => {
    switch (speaker) {
      case 'detetive': return 'left'
      case 'fragmentado': return 'right'
      case 'drCell': return 'center'
      default: return 'center'
    }
  }, [])

  useEffect(() => {
    if (!charactersLoaded || !currentDialogue) return

    const speaker = currentDialogue.speaker
    const emotion = (currentDialogue.emotion as CharacterEmotion) || 'neutral'

    if (speaker === 'narrador' || speaker === 'info') {
      setSceneCharacters(prev => prev.map(c => ({ ...c, isActive: false })))
      return
    }

    const charId = speaker === 'drCell' ? 'drCell' : speaker
    const characterData = characters.find(c => c.id === charId)
    if (!characterData) return

    const position = getSpeakerPosition(speaker)

    setSceneCharacters(prev => {
      const existingIndex = prev.findIndex(c => c.data.id === characterData.id)
      if (existingIndex >= 0) {
        return prev.map((c, i) => ({
          ...c,
          emotion: i === existingIndex ? emotion : c.emotion,
          isActive: i === existingIndex
        }))
      } else {
        const newChar: SceneCharacter = { data: characterData, position, emotion, isActive: true }
        const updatedPrev = prev.map(c => ({ ...c, isActive: false }))
        const trimmed = updatedPrev.slice(-1)
        return [...trimmed, newChar]
      }
    })
  }, [currentDialogue, characters, charactersLoaded, getSpeakerPosition])

  useEffect(() => {
    if (!currentDialogue || currentDialogue.speaker === 'info') {
      setIsTyping(false)
      setDisplayedText(currentDialogue?.text || '')
      return
    }

    setIsTyping(true)
    setDisplayedText('')
    
    let index = 0
    const text = currentDialogue.text
    const speed = 20

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [currentDialogue, currentIndex])

  const handleNext = useCallback(() => {
    if (isTyping) {
      setIsTyping(false)
      setDisplayedText(currentDialogue?.text || '')
      return
    }
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete()
    }
  }, [isTyping, currentIndex, dialogues.length, currentDialogue, onComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
      if (e.key === 'Escape' && onSkip) onSkip()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, onSkip])

  useEffect(() => {
    if (!dialogues || dialogues.length === 0 || !currentDialogue) onComplete()
  }, [dialogues, currentDialogue, onComplete])

  if (!currentDialogue || dialogues.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    )
  }

  const isInfo = currentDialogue.speaker === 'info' && currentDialogue.infoBox
  const progress = ((currentIndex + 1) / dialogues.length) * 100
  const hasCharacters = charactersLoaded && sceneCharacters.length > 0 && !isInfo

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">

      {/* ── Header (progresso) ── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate pr-2">{story.title}</h1>
            <span className="text-[10px] text-gray-400 flex-shrink-0">
              {currentIndex + 1}/{dialogues.length}
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Personagens — ocupa tudo que sobrar entre header e dialogo ── */}
      {hasCharacters && (
        <div className="flex-1 relative min-h-0 overflow-hidden">
          {/* gradiente de fundo baseado no falante */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none",
            currentDialogue.speaker === 'fragmentado' && 'from-red-950/60',
            currentDialogue.speaker === 'drCell'      && 'from-emerald-950/60',
            currentDialogue.speaker === 'detetive'    && 'from-blue-950/60'
          )} />

          <AnimatePresence mode="sync">
            {sceneCharacters.map((sc) => (
              <CharacterDisplay
                key={sc.data.id}
                character={sc.data}
                emotion={sc.emotion}
                position={sc.position}
                isActive={sc.isActive}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Caixa de diálogo — altura fixa e compacta ── */}
      <div className="flex-shrink-0 px-3 pt-2 pb-1 max-w-2xl w-full mx-auto">
        {isInfo ? (
          <InfoBox infoBox={currentDialogue.infoBox!} />
        ) : (
          <div className={cn(
            "bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border shadow-xl",
            currentDialogue.speaker === 'fragmentado' ? 'border-red-500/30'     :
            currentDialogue.speaker === 'drCell'      ? 'border-emerald-500/30' :
            currentDialogue.speaker === 'detetive'    ? 'border-cyan-500/30'    :
            'border-white/10'
          )}>
            <CharacterAvatar speaker={currentDialogue.speaker} />
            <p className={cn(
              "text-sm sm:text-base text-gray-100 leading-relaxed line-clamp-4",
              currentDialogue.speaker === 'narrador' && 'italic text-gray-300'
            )}>
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>
        )}
      </div>

      {/* ── Botões de navegação ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-white/10">
        <div className="max-w-2xl mx-auto flex gap-2">
          {onSkip && (
            <Button
              onClick={onSkip}
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-white/30 bg-slate-700 text-white hover:bg-slate-600 hover:text-white text-xs font-semibold"
            >
              Pular
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={cn(
              "flex-1 h-10 text-sm font-bold rounded-xl shadow-lg",
              storyType === 'villainChallenge'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600'
            )}
          >
            {isTyping ? 'Continuar' :
             currentIndex < dialogues.length - 1 ? <><span>Próximo</span><ChevronRight className="w-4 h-4 ml-1" /></> :
             storyType === 'villainChallenge' ? <><span>Aceitar Desafio!</span><Sparkles className="w-4 h-4 ml-1" /></> :
             storyType === 'conclusion' ? 'Continuar' : 'Começar'}
          </Button>
        </div>
        <p className="text-center text-[9px] text-gray-500 mt-1">
          Pressione Enter ou Espaço para continuar
        </p>
      </div>
    </div>
  )
}
