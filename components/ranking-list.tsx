'use client'

import { Trophy, Medal, Flame, RefreshCw, User } from 'lucide-react'
import { useRanking } from '@/hooks/use-ranking'
import { useAuth } from '@/contexts/auth-context'

interface RankingListProps {
  limit?: number
  showRefresh?: boolean
  className?: string
  onViewProfile?: (userId: string) => void
}

export function RankingList({ limit = 10, showRefresh = true, className = '', onViewProfile }: RankingListProps) {
  const { ranking, userPosition, isLoading, refresh } = useRanking(limit)
  const { user, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <h3 className="font-bold text-foreground text-sm sm:text-base">Ranking Global</h3>
        </div>
        {showRefresh && (
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-secondary transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Atualizar ranking"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* User Position Card */}
      {isAuthenticated && userPosition && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
              {userPosition}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Sua posicao</p>
              <p className="text-xs text-muted-foreground truncate">{user?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ranking List */}
      <div className="space-y-2">
        {ranking.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Nenhum jogador no ranking ainda</p>
            <p className="text-sm">Seja o primeiro!</p>
          </div>
        ) : (
          ranking.map((entry, index) => (
            <button
              key={entry.uid}
              onClick={() => onViewProfile?.(entry.uid)}
              disabled={!onViewProfile}
              className={`w-full p-2 sm:p-3 rounded-xl flex items-center gap-2 sm:gap-3 transition-colors text-left ${
                user?.id === entry.uid
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-card border border-border hover:bg-secondary/50'
              } ${onViewProfile ? 'cursor-pointer active:scale-[0.98]' : ''}`}
            >
              {/* Position */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                'bg-secondary text-muted-foreground'
              }`}>
                {index === 0 ? <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : index + 1}
              </div>

              {/* Avatar */}
              {entry.photoURL ? (
                <img
                  src={entry.photoURL}
                  alt=""
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate text-sm sm:text-base">
                  {entry.displayName}
                  {user?.id === entry.uid && (
                    <span className="ml-1 sm:ml-2 text-xs text-primary">(Voce)</span>
                  )}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <span className="truncate">{entry.completedPhases} fases</span>
                  {entry.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-orange-500 flex-shrink-0">
                      <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {entry.streak}
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-foreground text-sm sm:text-base">{entry.totalScore.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">pontos</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
