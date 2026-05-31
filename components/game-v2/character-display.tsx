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
  detetive:   'from-blue-500 to-blue-700',
  drCell:     'from-emerald-500 to-emerald-700',
  fragmentado:'from-purple-600 to-purple-900'
}

export function CharacterDisplay({
  character,
  emotion,
  position,
  isActive = true,
  className
}: CharacterDisplayProps) {
  const [imageError, setImageError] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!character) { setCurrentImageUrl(null); return }
    const emotionImage = character.images?.[emotion]
    const neutralImage = character.images?.neutral
    setCurrentImageUrl(emotionImage || neutralImage || null)
    setImageError(false)
  }, [character, emotion])

  if (!character) return null

  // Horizontal anchor por posição
  const positionClasses = {
    left:   'left-[5%]  sm:left-[8%]',
    center: 'left-1/2 -translate-x-1/2',
    right:  'right-[5%] sm:right-[8%]'
  }

  const hasImage = currentImageUrl && !imageError

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${character.id}-${emotion}`}
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: isActive ? 1 : 0.35, y: 0, scale: isActive ? 1 : 0.92 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          // Ancora no rodapé do contêiner e ocupa toda a altura disponível
          'absolute bottom-0',
          positionClasses[position],
          // Largura proporcional à viewport; altura 100% do pai (flex-1)
          'w-[28vw] sm:w-[22vw] md:w-[18vw] max-w-[180px]',
          'h-full',              // preenche o flex-1 do pai
          'pointer-events-none select-none',
          className
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
              sizes="(max-width: 640px) 28vw, (max-width: 768px) 22vw, 18vw"
            />
          </div>
        ) : (
          <div className={cn(
            'relative w-full h-full rounded-t-full bg-gradient-to-b',
            CHARACTER_FALLBACK_COLORS[character.id] || 'from-gray-500 to-gray-700',
            'flex flex-col items-center justify-center border-2 border-white/20 shadow-2xl'
          )}>
            <div className="text-2xl sm:text-4xl text-white/80 mb-1">
              {character.id === 'detetive'    && '?'}
              {character.id === 'drCell'      && 'D'}
              {character.id === 'fragmentado' && 'F'}
            </div>
            <span className="hidden sm:block text-[10px] font-bold text-white/90 text-center px-1">
              {character.name}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Hook inalterado
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
    emotion: CharacterEmotion = 'neutral'
  ) => {
    setCharacters(prev => ({ ...prev, [position]: { data: character, emotion } }))
    setActivePosition(position)
  }

  const hideCharacter = (position: 'left' | 'center' | 'right') => {
    setCharacters(prev => { const next = { ...prev }; delete next[position]; return next })
  }

  const updateEmotion = (position: 'left' | 'center' | 'right', emotion: CharacterEmotion) => {
    setCharacters(prev => {
      if (!prev[position]) return prev
      return { ...prev, [position]: { ...prev[position]!, emotion } }
    })
  }

  const clearAll = () => { setCharacters({}); setActivePosition(null) }

  return { characters, activePosition, showCharacter, hideCharacter, updateEmotion, clearAll, setActivePosition }
}
