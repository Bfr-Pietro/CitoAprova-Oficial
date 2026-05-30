'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useGameProgress } from '@/hooks/use-game-progress'
import { getAllUsers, getGlobalRanking, type UserProfileData, type RankingEntry } from '@/lib/firebase/firestore-service'
import { PHASES } from '@/lib/phases-data'
import {
  Shield,
  Users,
  Trophy,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  LogOut,
  Home,
  Unlock,
  Gamepad2,
  RefreshCw,
  FlaskConical,
  UserCircle
} from 'lucide-react'
import Link from 'next/link'
import MinigameTester from '@/components/admin/minigame-tester'
import CharacterManager from '@/components/admin/character-manager'
import ReviewsManager from '@/components/admin/reviews-manager'
import { MessageSquareQuote } from 'lucide-react'

export default function AdminPanel() {
  const router = useRouter()
  const { user, firebaseUser, isAdmin, isLoading: authLoading, logout } = useAuth()
  const { unlockAllPhases, adminSetPhase, resetProgress } = useGameProgress()
  
  const [users, setUsers] = useState<UserProfileData[]>([])
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState<'game' | 'minigames' | 'characters' | 'reviews' | 'users' | 'ranking'>('game')
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      // Redirect to home without any indication that admin exists
      router.replace('/')
    }
  }, [authLoading, user, isAdmin, router])

  // Load admin data
  useEffect(() => {
    const loadData = async () => {
      if (!firebaseUser || !isAdmin) return
      
      setIsLoadingData(true)
      try {
        const [usersData, rankingData] = await Promise.all([
          getAllUsers(firebaseUser.uid),
          getGlobalRanking(100)
        ])
        setUsers(usersData)
        setRanking(rankingData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [firebaseUser, isAdmin])

  const handlePlayPhase = (phaseId: number) => {
    adminSetPhase(phaseId)
    router.push('/jogar')
  }

  const handleUnlockAll = () => {
    unlockAllPhases()
  }

  const handleResetProgress = () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
      resetProgress()
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const refreshData = async () => {
    if (!firebaseUser || !isAdmin) return
    setIsLoadingData(true)
    try {
      const [usersData, rankingData] = await Promise.all([
        getAllUsers(firebaseUser.uid),
        getGlobalRanking(100)
      ])
      setUsers(usersData)
      setRanking(rankingData)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // Loading state
  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Ir para Home"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-destructive"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'game'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Gamepad2 className="w-4 h-4 inline-block mr-2" />
              Fases
            </button>
            <button
              onClick={() => setActiveTab('minigames')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'minigames'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FlaskConical className="w-4 h-4 inline-block mr-2" />
              Minigames
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'characters'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserCircle className="w-4 h-4 inline-block mr-2" />
              Personagens
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4 inline-block mr-2" />
              Avaliacoes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'ranking'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Trophy className="w-4 h-4 inline-block mr-2" />
              Ranking
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Game Testing Tab */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleUnlockAll}
                className="p-4 bg-card border border-border rounded-xl hover:border-primary transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Unlock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Desbloquear Tudo</p>
                  <p className="text-xs text-muted-foreground">Acesso a todas as fases</p>
                </div>
              </button>

              <button
                onClick={handleResetProgress}
                className="p-4 bg-card border border-border rounded-xl hover:border-destructive transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Resetar Progresso</p>
                  <p className="text-xs text-muted-foreground">Voltar ao inicio</p>
                </div>
              </button>

              <Link
                href="/jogar"
                className="p-4 bg-card border border-border rounded-xl hover:border-accent transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Ir para o Jogo</p>
                  <p className="text-xs text-muted-foreground">Abrir tela do jogo</p>
                </div>
              </Link>
            </div>

            {/* Phase List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground">Fases Disponiveis</h2>
                <p className="text-sm text-muted-foreground">Clique em uma fase para iniciar diretamente</p>
              </div>
              
              <div className="divide-y divide-border">
                {PHASES.map((phase) => (
                  <div key={phase.id} className="bg-background">
                    <button
                      onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {phase.id}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">{phase.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Bloco {phase.blockId} - {phase.minigames.length} minigames
                          </p>
                        </div>
                      </div>
                      {expandedPhase === phase.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedPhase === phase.id && (
                      <div className="px-4 pb-4 space-y-2">
                        <button
                          onClick={() => handlePlayPhase(phase.id)}
                          className="w-full p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Jogar esta Fase
                        </button>
                        
                        <div className="p-3 bg-secondary rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Minigames:</p>
                          <div className="flex flex-wrap gap-2">
                            {phase.minigames.map((minigame, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-background rounded text-xs font-medium text-foreground"
                              >
                                {minigame.type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Minigames Testing Tab */}
        {activeTab === 'minigames' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-foreground text-lg">Testar Minigames</h2>
              <p className="text-sm text-muted-foreground">Teste qualquer minigame individualmente com diferentes dificuldades</p>
            </div>
            <MinigameTester phaseId={1} />
          </div>
        )}

        {/* Characters Management Tab */}
        {activeTab === 'characters' && firebaseUser && (
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-foreground text-lg">Gerenciar Personagens</h2>
              <p className="text-sm text-muted-foreground">Configure as imagens dos personagens para o sistema de visual novel</p>
            </div>
            <CharacterManager 
              adminUid={firebaseUser.uid} 
              adminEmail={firebaseUser.email} 
            />
          </div>
        )}

        {/* Reviews Management Tab */}
        {activeTab === 'reviews' && firebaseUser && (
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-foreground text-lg">Gerenciar Avaliacoes</h2>
              <p className="text-sm text-muted-foreground">Adicione, edite ou remova avaliacoes que aparecem na pagina inicial</p>
            </div>
            <ReviewsManager 
              adminUid={firebaseUser.uid} 
              adminEmail={firebaseUser.email} 
            />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Usuarios Cadastrados</h2>
              <button
                onClick={refreshData}
                disabled={isLoadingData}
                className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Provedor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Pontuacao</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Fases</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((u) => (
                        <tr key={u.uid} className="hover:bg-secondary/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {u.displayName?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span className="font-medium text-foreground">{u.displayName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              u.provider === 'google' 
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {u.provider}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{u.totalScore || 0}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{u.completedPhases?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Ranking Global</h2>
              <button
                onClick={refreshData}
                disabled={isLoadingData}
                className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="divide-y divide-border">
                  {ranking.map((entry, index) => (
                    <div
                      key={entry.uid}
                      className={`p-4 flex items-center gap-4 ${
                        index < 3 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-amber-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {entry.photoURL ? (
                        <img src={entry.photoURL} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {entry.displayName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{entry.displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.completedPhases} fases - Streak: {entry.streak}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-foreground">{entry.totalScore}</p>
                        <p className="text-xs text-muted-foreground">pontos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
