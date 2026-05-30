'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { BLOCKS, PHASES } from '@/lib/phases-data'
import type { Phase } from '@/lib/minigame-types'
import { 
  ChevronLeft,
  Lock, 
  CheckCircle2, 
  Star, 
  Microscope,
  Atom,
  Leaf,
  Zap,
  Factory,
  Truck,
  Shield,
  Brain,
  Skull,
  Headphones,
  Video,
  BookOpen,
  Mic,
  Trophy,
  Flame,
  Heart,
  User
} from 'lucide-react'

interface PhaseSelectorProps {
  phases: Phase[]
  completedPhases: number[]
  currentPhaseIndex: number
  onSelectPhase: (phase: Phase) => void
  onBack: () => void
  totalScore?: number
  streak?: number
  isAdmin?: boolean
  onGoToAchievements?: () => void
  onGoToRanking?: () => void
  onGoToProfile?: () => void
}

// Helper function to get phases by block
const getPhasesByBlock = (blockId: number) => {
  return PHASES.filter(p => p.blockId === blockId)
}

const blockIcons: Record<string, React.ElementType> = {
  microscope: Microscope,
  cells: Atom,
  factory: Factory,
  leaf: Leaf,
  shield: Shield,
  truck: Truck,
  zap: Zap,
  brain: Brain,
  skull: Skull
}

// Icons for individual phases in the path
const phaseIcons = [Headphones, Star, Video, BookOpen, Mic, Trophy, Headphones, Star, Video]

export function PhaseSelector({ 
  completedPhases, 
  onSelectPhase, 
  onBack,
  totalScore = 0,
  streak = 0,
  isAdmin = false,
  onGoToAchievements,
  onGoToRanking,
  onGoToProfile
}: PhaseSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const currentPhaseRef = useRef<HTMLDivElement>(null)

  const isPhaseUnlocked = (phase: Phase) => {
    if (isAdmin) return true // Admin sees all phases unlocked
    if (phase.id === 1) return true
    return completedPhases.includes(phase.id - 1)
  }

  // Scroll to current phase on mount
  useEffect(() => {
    if (currentPhaseRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        currentPhaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [])

  // Duolingo-style path positions for phases within a block
  const getPathPosition = (index: number, total: number) => {
    // Serpentine pattern - zigzag left and right
    const amplitude = 30 // How far left/right the path goes (percentage)
    const baseOffset = 50 // Center position
    
    // Create a wave pattern
    const direction = index % 2 === 0 ? 1 : -1
    const offset = direction * amplitude
    
    return baseOffset + offset * 0.7
  }

  // Find current unlocked phase (first phase that is unlocked but not completed)
  const currentPhaseId = PHASES.find(p => isPhaseUnlocked(p) && !completedPhases.includes(p.id))?.id || 1

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Duolingo-style top bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Stats */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Streak */}
            <div className="flex items-center gap-1.5">
              <Flame className={cn(
                "w-5 h-5 sm:w-6 sm:h-6",
                streak > 0 ? "text-orange-500" : "text-gray-300"
              )} />
              <span className="font-bold text-foreground text-sm sm:text-base">{streak}</span>
            </div>

            {/* Total Score */}
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-foreground text-sm sm:text-base">{totalScore.toLocaleString()}</span>
            </div>

            {/* Hearts/Lives */}
            <div className="flex items-center gap-1.5">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />
              <span className="font-bold text-foreground text-sm sm:text-base">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable phases container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-24"
      >
        <div className="max-w-lg mx-auto">
          {/* Render all blocks with their phases */}
          {BLOCKS.map((block, blockIndex) => {
            const blockPhases = getPhasesByBlock(block.id)
            const BlockIcon = blockIcons[block.icon] || Atom
            const blockCompleted = blockPhases.filter(p => completedPhases.includes(p.id)).length
            const isBlockComplete = blockCompleted === blockPhases.length

            return (
              <div key={block.id}>
                {/* Block divider/header */}
                <div className="px-4 pt-6 pb-2">
                  <div className={cn(
                    "rounded-2xl p-4 flex items-center justify-between shadow-lg",
                    "bg-gradient-to-r",
                    block.color
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <BlockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
                          Bloco {block.id}
                        </p>
                        <h2 className="text-white font-bold text-sm sm:text-base">{block.name}</h2>
                      </div>
                    </div>
                    {isBlockComplete && (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Phase path for this block */}
                <div className="relative px-4 py-4">
                  {/* SVG Path connecting phases */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ height: `${blockPhases.length * 100 + 20}px` }}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`pathGradient-${block.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--border))" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="hsl(var(--border))" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    {blockPhases.map((_, index) => {
                      if (index === 0) return null
                      const x1 = getPathPosition(index - 1, blockPhases.length)
                      const y1 = 50 + (index - 1) * 100
                      const x2 = getPathPosition(index, blockPhases.length)
                      const y2 = 50 + index * 100
                      const midY = (y1 + y2) / 2
                      
                      return (
                        <path
                          key={index}
                          d={`M ${x1}% ${y1} Q ${x1}% ${midY} ${x2}% ${y2}`}
                          fill="none"
                          stroke={`url(#pathGradient-${block.id})`}
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      )
                    })}
                  </svg>

                  {/* Phase buttons */}
                  <div 
                    className="relative"
                    style={{ minHeight: `${blockPhases.length * 100}px` }}
                  >
                    {blockPhases.map((phase, index) => {
                      const isUnlocked = isPhaseUnlocked(phase)
                      const isCompleted = completedPhases.includes(phase.id)
                      const isCurrent = phase.id === currentPhaseId
                      const PhaseIcon = phaseIcons[index % phaseIcons.length]
                      const xPosition = getPathPosition(index, blockPhases.length)

                      return (
                        <div
                          key={phase.id}
                          ref={isCurrent ? currentPhaseRef : null}
                          className="absolute flex flex-col items-center"
                          style={{
                            left: `${xPosition}%`,
                            top: `${index * 100}px`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          {/* 3D circular button - Duolingo style */}
                          <button
                            onClick={() => isUnlocked && onSelectPhase(phase)}
                            disabled={!isUnlocked}
                            className={cn(
                              "relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full transition-all duration-200",
                              "flex items-center justify-center",
                              isCompleted 
                                ? "cursor-pointer hover:scale-105 active:scale-95" 
                                : isCurrent 
                                  ? "cursor-pointer hover:scale-105 active:scale-95" 
                                  : "cursor-not-allowed"
                            )}
                          >
                            {/* Button shadow/depth */}
                            <div 
                              className={cn(
                                "absolute inset-0 rounded-full translate-y-1.5",
                                isCompleted 
                                  ? "bg-emerald-700" 
                                  : isCurrent 
                                    ? "bg-emerald-700"
                                    : "bg-gray-400"
                              )}
                            />
                            
                            {/* Button face */}
                            <div 
                              className={cn(
                                "relative w-full h-full rounded-full flex items-center justify-center",
                                "border-4 border-b-0",
                                isCompleted 
                                  ? "bg-gradient-to-b from-emerald-400 to-emerald-500 border-emerald-300" 
                                  : isCurrent 
                                    ? "bg-gradient-to-b from-emerald-400 to-emerald-500 border-emerald-300"
                                    : "bg-gradient-to-b from-gray-300 to-gray-400 border-gray-200"
                              )}
                            >
                              {isUnlocked ? (
                                isCompleted ? (
                                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                ) : (
                                  <PhaseIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                )
                              ) : (
                                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                              )}
                            </div>

                            {/* Glow effect for current */}
                            {isCurrent && (
                              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                            )}
                          </button>

                          {/* Phase title (shown for current phase) */}
                          {isCurrent && (
                            <div className="mt-2 bg-white rounded-xl px-3 py-1.5 shadow-lg border border-gray-100 max-w-[140px]">
                              <p className="text-xs font-bold text-gray-700 text-center line-clamp-2">
                                {phase.title}
                              </p>
                            </div>
                          )}

                          {/* Stars for completed phases */}
                          {isCompleted && (
                            <div className="flex gap-0.5 mt-1.5">
                              {[1, 2, 3].map((star) => (
                                <Star 
                                  key={star} 
                                  className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Subtle divider between blocks (except last) */}
                {blockIndex < BLOCKS.length - 1 && (
                  <div className="px-8 py-2">
                    <div className="border-t border-dashed border-border" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom navigation bar - Duolingo style */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-bottom">
        <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
          <button 
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-600">Fases</span>
          </button>
          
          <button 
            onClick={onGoToAchievements}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Conquistas</span>
          </button>
          
          <button 
            onClick={onGoToRanking}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Ranking</span>
          </button>
          
          <button 
            onClick={onGoToProfile}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  )
}