'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CharacterData, CharacterEmotion } from '@/lib/firebase/firestore-service'

interface CharacterDisplayProps {
  character: CharacterData | null
  emotion: CharacterEmotion
  position: 'left' | 'center' | 'right'
  isActive?: boolean
  className?: string
}

const CHARACTER_FALLBACK_COLORS: Record<string, string> = {
  detetive:    'from-blue-500 to-blue-700',
  drCell:      'from-emerald-500 to-emerald-700',
  fragmentado: 'from-purple-600 to-purple-900',
}

export function CharacterDisplay({
  character,
  emotion,
  position,
  isActive = true,
  className,
}: CharacterDisplayProps) {
  const [imageError, setImageError] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!character) { setCurrentImageUrl(null); return }
    setCurrentImageUrl(character.images?.[emotion] || character.images?.neutral || null)
    setImageError(false)
  }, [character, emotion])

  if (!character) return null

  // Posição horizontal: left ancora à esquerda, right à direita, center ao meio
  // Usando % do contêiner pai (que é 100% da área de personagens)
  const positionClasses = {
    left:   'left-[4%]',
    center: 'left-1/2 -translate-x-1/2',
    right:  'right-[4%]',
  }[position]

  const hasImage = currentImageUrl && !imageError

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${character.id}-${emotion}`}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: isActive ? 1 : 0.28, y: 0, scale: isActive ? 1 : 0.93 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          // ancora no rodapé do pai, ocupa 100% da altura do pai
          'absolute bottom-0 h-full',
          // largura responsiva
          'w-[22vw] sm:w-[18vw] md:w-[14vw] max-w-[200px] min-w-[70px]',
          positionClasses,
          'pointer-events-none select-none',
          className,
        )}
      >
        {hasImage ? (
          <div className="relative w-full h-full">
            <Image
              src={currentImageUrl}
              alt={character.name}
              fill
              className="object-contain object-bottom"
              onError={() => setImageError(true)}
              priority
              sizes="(max-width: 640px) 22vw, (max-width: 768px) 18vw, 200px"
            />
          </div>
        ) : (
          // Fallback compacto ancorado na base — não infla a área
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1">
            <div className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br',
              'flex items-center justify-center shadow-2xl border-2 border-white/20',
              CHARACTER_FALLBACK_COLORS[character.id] || 'from-gray-500 to-gray-700',
            )}>
              <span className="text-lg font-bold text-white">
                {character.name?.[0] ?? '?'}
              </span>
            </div>
            <span className="text-[9px] font-semibold text-white/60 text-center leading-tight">
              {character.name}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Hook auxiliar — mantido intacto
export function useCharacterScene() {
  const [characters, setCharacters] = useState<{
    left?:   { data: CharacterData; emotion: CharacterEmotion }
    center?: { data: CharacterData; emotion: CharacterEmotion }
    right?:  { data: CharacterData; emotion: CharacterEmotion }
  }>({})
  const [activePosition, setActivePosition] = useState<'left' | 'center' | 'right' | null>(null)

  const showCharacter = (
    position: 'left' | 'center' | 'right',
    character: CharacterData,
    emotion: CharacterEmotion = 'neutral',
  ) => {
    setCharacters(prev => ({ ...prev, [position]: { data: character, emotion } }))
    setActivePosition(position)
  }

  const hideCharacter = (position: 'left' | 'center' | 'right') => {
    setCharacters(prev => { const next = { ...prev }; delete next[position]; return next })
  }

  const updateEmotion = (position: 'left' | 'center' | 'right', emotion: CharacterEmotion) => {
    setCharacters(prev =>
      prev[position] ? { ...prev, [position]: { ...prev[position]!, emotion } } : prev
    )
  }

  const clearAll = () => { setCharacters({}); setActivePosition(null) }

  return { characters, activePosition, showCharacter, hideCharacter, updateEmotion, clearAll, setActivePosition }
}
