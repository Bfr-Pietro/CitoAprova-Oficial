'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getGlobalRanking, getUserRankingPosition, type RankingEntry } from '@/lib/firebase/firestore-service'

interface UseRankingReturn {
  ranking: RankingEntry[]
  userPosition: number | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useRanking(limit: number = 50): UseRankingReturn {
  const { firebaseUser, isAuthenticated } = useAuth()
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [userPosition, setUserPosition] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRanking = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const rankingData = await getGlobalRanking(limit)
      setRanking(rankingData)

      // Get user's position if authenticated
      if (isAuthenticated && firebaseUser) {
        const position = await getUserRankingPosition(firebaseUser.uid)
        setUserPosition(position)
      }
    } catch (err) {
      console.error('Error fetching ranking:', err)
      setError('Erro ao carregar ranking')
    } finally {
      setIsLoading(false)
    }
  }, [limit, isAuthenticated, firebaseUser])

  useEffect(() => {
    fetchRanking()
  }, [fetchRanking])

  return {
    ranking,
    userPosition,
    isLoading,
    error,
    refresh: fetchRanking
  }
}
