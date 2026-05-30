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

// Character positions for visual novel style
type CharacterPosition = 'left' | 'center' | 'right'
interface SceneCharacter {
  data: CharacterData
  position: CharacterPosition
  emotion: CharacterEmotion
  isActive: boolean
}

// Avatares dos personagens
const CharacterAvatar = ({ speaker }: { speaker: string }) => {
  const avatarConfig = {
    detetive: {
      bg: 'from-blue-500 to-cyan-500',
      icon: <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      name: 'Detetive'
    },
    drCell: {
      bg: 'from-emerald-500 to-teal-500',
      icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      name: 'Dr. Cell'
    },
    fragmentado: {
      bg: 'from-red-600 to-purple-700',
      icon: <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      name: 'Fragmentado'
    },
    narrador: {
      bg: 'from-gray-600 to-gray-700',
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      name: 'Narrador'
    },
    info: {
      bg: 'from-amber-500 to-orange-500',
      icon: <Info className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
      name: 'Informacao'
    }
  }

  const config = avatarConfig[speaker as keyof typeof avatarConfig] || avatarConfig.narrador

  return (
    <div className="flex items-center gap-2 mb-2 sm:mb-3">
      <div className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg flex-shrink-0",
        config.bg
      )}>
        {config.icon}
      </div>
      <span className={cn(
        "font-bold text-sm sm:text-base truncate",
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

// Caixa de informacao importante
const InfoBox = ({ infoBox }: { infoBox: NonNullable<StoryDialogue['infoBox']> }) => {
  const typeConfig = {
    scientist: {
      bg: 'from-blue-900/80 to-indigo-900/80',
      border: 'border-blue-500/50',
      icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />,
      label: 'Cientista'
    },
    concept: {
      bg: 'from-emerald-900/80 to-teal-900/80',
      border: 'border-emerald-500/50',
      icon: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />,
      label: 'Conceito'
    },
    curiosity: {
      bg: 'from-purple-900/80 to-pink-900/80',
      border: 'border-purple-500/50',
      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />,
      label: 'Curiosidade'
    },
    important: {
      bg: 'from-amber-900/80 to-orange-900/80',
      border: 'border-amber-500/50',
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />,
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
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-300 font-bold">
          {config.label}
        </span>
      </div>
      <h3 className="text-sm sm:text-base font-bold text-white mb-1 sm:mb-2">{infoBox.title}</h3>
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

  // Load characters from Firebase
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

  // Map speaker to position for visual novel layout
  const getSpeakerPosition = useCallback((speaker: string): CharacterPosition => {
    switch (speaker) {
      case 'detetive':
        return 'left'
      case 'fragmentado':
        return 'right'
      case 'drCell':
        return 'center'
      default:
        return 'center'
    }
  }, [])

  // Update scene characters based on dialogue history
  useEffect(() => {
    if (!charactersLoaded || !currentDialogue) return

    const speaker = currentDialogue.speaker
    const emotion = (currentDialogue.emotion as CharacterEmotion) || 'neutral'

    // Skip narrador and info speakers
    if (speaker === 'narrador' || speaker === 'info') {
      // Dim all characters when narrator speaks
      setSceneCharacters(prev => prev.map(c => ({ ...c, isActive: false })))
      return
    }

    const charId = speaker === 'drCell' ? 'drCell' : speaker
    const characterData = characters.find(c => c.id === charId)

    if (!characterData) return

    const position = getSpeakerPosition(speaker)

    setSceneCharacters(prev => {
      // Check if this character is already in the scene
      const existingIndex = prev.findIndex(c => c.data.id === characterData.id)

      if (existingIndex >= 0) {
        // Update existing character
        return prev.map((c, i) => ({
          ...c,
          emotion: i === existingIndex ? emotion : c.emotion,
          isActive: i === existingIndex
        }))
      } else {
        // Add new character to scene
        const newChar: SceneCharacter = {
          data: characterData,
          position,
          emotion,
          isActive: true
        }
        
        // Deactivate other characters
        const updatedPrev = prev.map(c => ({ ...c, isActive: false }))
        
        // Keep only last 2 characters in scene to avoid clutter
        const trimmed = updatedPrev.slice(-1)
        
        return [...trimmed, newChar]
      }
    })
  }, [currentDialogue, characters, charactersLoaded, getSpeakerPosition])

  // Efeito de digitacao
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
    const speed = 20 // ms por caractere

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
      // Se ainda esta digitando, mostra o texto completo
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
      if (e.key === 'Escape' && onSkip) {
        onSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, onSkip])

  // Se nao ha dialogos ou currentDialogue e undefined, chama onComplete imediatamente
  useEffect(() => {
    if (!dialogues || dialogues.length === 0 || !currentDialogue) {
      onComplete()
    }
  }, [dialogues, currentDialogue, onComplete])

  if (!currentDialogue || dialogues.length === 0) {
    return (
      <div className="h-[100dvh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  const isInfo = currentDialogue.speaker === 'info' && currentDialogue.infoBox
  const progress = ((currentIndex + 1) / dialogues.length) * 100

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Header com titulo e progresso */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h1 className="text-sm sm:text-lg font-bold text-white truncate pr-2">{story.title}</h1>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {currentIndex + 1} / {dialogues.length}
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

      {/* Character Display Area - Visual Novel Style */}
      {charactersLoaded && sceneCharacters.length > 0 && !isInfo && (
        <div className="flex-shrink-0 relative h-24 xs:h-28 sm:h-36 md:h-44 overflow-hidden">
          {/* Background gradient based on speaker */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent",
            currentDialogue.speaker === 'fragmentado' && 'from-red-950/50',
            currentDialogue.speaker === 'drCell' && 'from-emerald-950/50',
            currentDialogue.speaker === 'detetive' && 'from-blue-950/50'
          )} />
          
          {/* Render all scene characters with their positions */}
          <AnimatePresence mode="sync">
            {sceneCharacters.map((sceneChar) => (
              <CharacterDisplay
                key={sceneChar.data.id}
                character={sceneChar.data}
                emotion={sceneChar.emotion}
                position={sceneChar.position}
                isActive={sceneChar.isActive}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Area de dialogo */}
      <div className={cn(
        "flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0",
        sceneCharacters.length > 0 && !isInfo ? "pt-0" : ""
      )}>
        <div className="max-w-2xl w-full max-h-full overflow-y-auto">
          {isInfo ? (
            // Caixa de informacao
            <InfoBox infoBox={currentDialogue.infoBox!} />
          ) : (
            // Dialogo normal
            <div className={cn(
              "bg-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border shadow-xl",
              currentDialogue.speaker === 'fragmentado' 
                ? 'border-red-500/30 shadow-red-500/10' 
                : currentDialogue.speaker === 'drCell'
                ? 'border-emerald-500/30 shadow-emerald-500/10'
                : currentDialogue.speaker === 'detetive'
                ? 'border-cyan-500/30 shadow-cyan-500/10'
                : 'border-white/10'
            )}>
              <CharacterAvatar speaker={currentDialogue.speaker} />
              
              <p className={cn(
                "text-sm sm:text-base text-gray-100 leading-relaxed",
                currentDialogue.speaker === 'narrador' && 'italic text-gray-300'
              )}>
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botoes de navegacao */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-white/10 pb-safe">
        <div className="max-w-2xl mx-auto flex gap-2 sm:gap-3">
          {onSkip && (
            <Button
              onClick={onSkip}
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-white/20 bg-white/10 text-slate-900 hover:bg-white/20 hover:text-slate-900 text-xs sm:text-sm font-semibold"
            >
              Pular
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={cn(
              "flex-1 h-10 sm:h-12 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-lg",
              storyType === 'villainChallenge' 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600'
            )}
          >
            {isTyping ? (
              'Continuar'
            ) : currentIndex < dialogues.length - 1 ? (
              <>
                Proximo <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : storyType === 'villainChallenge' ? (
              <>
                Aceitar Desafio! <Sparkles className="w-4 h-4 ml-1" />
              </>
            ) : storyType === 'conclusion' ? (
              'Continuar'
            ) : (
              'Comecar'
            )}
          </Button>
        </div>
        
        <p className="text-center text-[9px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
          Pressione Enter ou Espaco para continuar
        </p>
      </div>
    </div>
  )
}
