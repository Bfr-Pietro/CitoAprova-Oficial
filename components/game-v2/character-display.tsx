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

// Fallback colors for characters without images
const CHARACTER_FALLBACK_COLORS: Record<string, string> = {
  detetive: 'from-blue-500 to-blue-700',
  drCell: 'from-emerald-500 to-emerald-700',
  fragmentado: 'from-purple-600 to-purple-900'
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

  // Get the appropriate image URL for the emotion
  useEffect(() => {
    if (!character) {
      setCurrentImageUrl(null)
      return
    }

    // Try to get image for specific emotion, fallback to neutral
    const emotionImage = character.images?.[emotion]
    const neutralImage = character.images?.neutral
    
    setCurrentImageUrl(emotionImage || neutralImage || null)
    setImageError(false)
  }, [character, emotion])

  if (!character) return null

  const positionClasses = {
    left: 'left-2 sm:left-4 md:left-8',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-2 sm:right-4 md:right-8'
  }

  const hasImage = currentImageUrl && !imageError

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${character.id}-${emotion}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: isActive ? 1 : 0.4, 
          y: 0, 
          scale: isActive ? 1 : 0.9 
        }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        className={cn(
          'absolute bottom-0',
          positionClasses[position],
          // Responsive sizing - smaller on mobile to prevent overflow
          'w-20 h-28 xs:w-24 xs:h-36 sm:w-32 sm:h-44 md:w-40 md:h-56 lg:w-48 lg:h-64',
          'pointer-events-none select-none',
          'max-w-[30vw]', // Prevent characters from taking too much horizontal space
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
              sizes="(max-width: 640px) 80px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
            />
          </div>
        ) : (
          // Fallback: stylized placeholder
          <div 
            className={cn(
              'relative w-full h-full rounded-t-full',
              'bg-gradient-to-b',
              CHARACTER_FALLBACK_COLORS[character.id] || 'from-gray-500 to-gray-700',
              'flex flex-col items-center justify-center',
              'border-2 border-white/20 shadow-2xl'
            )}
          >
            {/* Character silhouette icon */}
            <div className="text-xl sm:text-2xl md:text-4xl text-white/80 mb-1 sm:mb-2">
              {character.id === 'detetive' && '?'}
              {character.id === 'drCell' && 'D'}
              {character.id === 'fragmentado' && 'F'}
            </div>
            
            {/* Character name - hidden on very small screens */}
            <span className="hidden sm:block text-[10px] sm:text-xs font-bold text-white/90 text-center px-1">
              {character.name}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Hook to manage character states in a scene
export function useCharacterScene() {
  const [characters, setCharacters] = useState<{
    left?: { data: CharacterData; emotion: CharacterEmotion }
    center?: { data: CharacterData; emotion: CharacterEmotion }
    right?: { data: CharacterData; emotion: CharacterEmotion }
  }>({})
  
  const [activePosition, setActivePosition] = useState<'left' | 'center' | 'right' | null>(null)

  const showCharacter = (
    position: 'left' | 'center' | 'right',
    character: CharacterData,
    emotion: CharacterEmotion = 'neutral'
  ) => {
    setCharacters(prev => ({
      ...prev,
      [position]: { data: character, emotion }
    }))
    setActivePosition(position)
  }

  const hideCharacter = (position: 'left' | 'center' | 'right') => {
    setCharacters(prev => {
      const next = { ...prev }
      delete next[position]
      return next
    })
  }

  const updateEmotion = (
    position: 'left' | 'center' | 'right',
    emotion: CharacterEmotion
  ) => {
    setCharacters(prev => {
      if (!prev[position]) return prev
      return {
        ...prev,
        [position]: { ...prev[position]!, emotion }
      }
    })
  }

  const clearAll = () => {
    setCharacters({})
    setActivePosition(null)
  }

  return {
    characters,
    activePosition,
    showCharacter,
    hideCharacter,
    updateEmotion,
    clearAll,
    setActivePosition
  }
}
