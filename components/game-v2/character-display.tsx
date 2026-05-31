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

  const positionStyle: React.CSSProperties =
    position === 'left'   ? { left: '6%' }                          :
    position === 'right'  ? { right: '6%' }                         :
    /* center */            { left: '50%', transform: 'translateX(-50%)' }

  const hasImage = currentImageUrl && !imageError

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${character.id}-${emotion}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: isActive ? 1 : 0.3, y: 0, scale: isActive ? 1 : 0.92 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute',
          bottom: 0,
          // largura proporcional, nunca maior que 220 px
          width: 'clamp(90px, 18vw, 220px)',
          // altura: 75% da viewport — personagem ocupa bem o espaço vertical
          height: '75vh',
          pointerEvents: 'none',
          userSelect: 'none',
          ...positionStyle,
        }}
        className={className}
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
              sizes="(max-width: 640px) 18vw, 220px"
            />
          </div>
        ) : (
          // Fallback compacto — apenas um círculo com inicial, não uma div enorme
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-1 pb-2">
            <div className={cn(
              'w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-2xl border-2 border-white/20',
              CHARACTER_FALLBACK_COLORS[character.id] || 'from-gray-500 to-gray-700'
            )}>
              <span className="text-xl font-bold text-white">
                {character.name?.[0] ?? '?'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-white/70">{character.name}</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export function useCharacterScene() {
  const [characters, setCharacters] = useState<{
    left?:   { data: CharacterData; emotion: CharacterEmotion }
    center?: { data: CharacterData; emotion: CharacterEmotion }
    right?:  { data: CharacterData; emotion: CharacterEmotion }
  }>({})
  const [activePosition, setActivePosition] = useState<'left' | 'center' | 'right' | null>(null)

  const showCharacter = (position: 'left' | 'center' | 'right', character: CharacterData, emotion: CharacterEmotion = 'neutral') => {
    setCharacters(prev => ({ ...prev, [position]: { data: character, emotion } }))
    setActivePosition(position)
  }
  const hideCharacter = (position: 'left' | 'center' | 'right') => {
    setCharacters(prev => { const next = { ...prev }; delete next[position]; return next })
  }
  const updateEmotion = (position: 'left' | 'center' | 'right', emotion: CharacterEmotion) => {
    setCharacters(prev => prev[position] ? { ...prev, [position]: { ...prev[position]!, emotion } } : prev)
  }
  const clearAll = () => { setCharacters({}); setActivePosition(null) }

  return { characters, activePosition, showCharacter, hideCharacter, updateEmotion, clearAll, setActivePosition }
}
