'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Phase } from '@/lib/minigame-types'
import { 
  ChevronLeft, 
  Play,
  Star,
  BookOpen,
  Gamepad2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PhaseScreenProps {
  phase: Phase
  onStart: () => void
  onBack: () => void
}

export function PhaseScreen({ phase, onStart, onBack }: PhaseScreenProps) {
  const [showEducation, setShowEducation] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <div className={cn("p-4 sm:p-6 bg-gradient-to-br text-white", phase.color)}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Voltar</span>
          </button>
          
          <div>
            <p className="text-white/70 text-xs sm:text-sm mb-1">{phase.blockName}</p>
            <h1 className="text-xl sm:text-2xl font-bold">{phase.title}</h1>
            <p className="text-white/80 mt-1 text-sm sm:text-base">{phase.description}</p>
          </div>

          {/* Info dos minigames */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-white/90 text-sm sm:text-base">{phase.minigames?.length || 3} minigames para completar</span>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {/* Conteudo educativo */}
          {showEducation && phase.educationalContent && (
            <div className="p-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-800 text-base sm:text-lg">{phase.educationalContent.title}</h2>
                </div>
                
                <ul className="space-y-2 sm:space-y-3">
                  {phase.educationalContent.facts?.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 flex-shrink-0 fill-amber-400" />
                      <span className="text-gray-600 text-sm sm:text-base">{fact}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setShowEducation(false)}
                  variant="outline"
                  className="mt-4 w-full border-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50 h-10 sm:h-11"
                >
                  Entendi! Vamos jogar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de minigames preview */}
          {!showEducation && (
            <div className="p-4 space-y-3">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                Minigames desta Fase
              </h2>

              {phase.minigames?.map((minigame, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center font-bold text-white text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">{minigame.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{minigame.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400" />
                      {minigame.timeLimit}s
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400" />
                      {minigame.targetScore} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={cn(
                        "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                        minigame.difficulty === 1 ? "bg-emerald-400" :
                        minigame.difficulty === 2 ? "bg-amber-400" :
                        "bg-red-400"
                      )} />
                      {minigame.difficulty === 1 ? 'Facil' : minigame.difficulty === 2 ? 'Medio' : 'Dificil'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botao de iniciar - fixed at bottom */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-8 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={onStart}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white rounded-xl shadow-lg"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Iniciar Fase
          </Button>
        </div>
      </div>
    </div>
  )
}
