'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useGameProgress } from '@/hooks/use-game-progress'
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Flame,
  Target,
  Edit2,
  Check,
  X,
  LogOut,
  Cloud,
  CloudOff
} from 'lucide-react'

interface UserProfileCardProps {
  onLogout?: () => void
  showLogout?: boolean
  className?: string
}

export function UserProfileCard({ onLogout, showLogout = true, className = '' }: UserProfileCardProps) {
  const { user, isAuthenticated, updateUser, logout } = useAuth()
  const { totalScore, completedPhases, streak, isSyncing } = useGameProgress()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setEditName(user?.name || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editName.trim() || editName.trim().length < 2) return
    
    setIsSaving(true)
    const success = await updateUser({ name: editName.trim() })
    setIsSaving(false)
    
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditName('')
  }

  const handleLogout = async () => {
    await logout()
    onLogout?.()
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={`p-4 bg-card border border-border rounded-xl ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Visitante</p>
            <p className="text-sm text-muted-foreground">Faca login para salvar seu progresso</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
      {/* Header with gradient */}
      <div className="h-20 bg-gradient-to-br from-primary to-accent relative">
        {/* Sync indicator */}
        <div className="absolute top-2 right-2">
          {isSyncing ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded-full text-white text-xs">
              <Cloud className="w-3 h-3 animate-pulse" />
              <span>Sincronizando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded-full text-white text-xs">
              <Cloud className="w-3 h-3" />
              <span>Sincronizado</span>
            </div>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="px-4 -mt-10 relative">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="w-20 h-20 rounded-full border-4 border-card object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-card bg-secondary flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 pt-2">
        {/* Name */}
        <div className="flex items-center gap-2 mb-1">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-3 py-1 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                placeholder="Seu nome"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={isSaving || editName.trim().length < 2}
                className="p-1 text-primary hover:bg-primary/10 rounded disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-1 text-muted-foreground hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg text-foreground">{user.name}</h3>
              <button
                onClick={handleEdit}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                title="Editar nome"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-secondary rounded-xl text-center">
            <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="font-bold text-foreground">{totalScore.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pontos</p>
          </div>
          <div className="p-3 bg-secondary rounded-xl text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="font-bold text-foreground">{completedPhases.length}</p>
            <p className="text-xs text-muted-foreground">Fases</p>
          </div>
          <div className="p-3 bg-secondary rounded-xl text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Sequencia</p>
          </div>
        </div>

        {/* Provider badge */}
        {user.provider && (
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              user.provider === 'google'
                ? 'bg-blue-500/10 text-blue-500'
                : 'bg-primary/10 text-primary'
            }`}>
              {user.provider === 'google' ? 'Conta Google' : 'Email/Senha'}
            </span>
          </div>
        )}

        {/* Logout button */}
        {showLogout && (
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 border border-border rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        )}
      </div>
    </div>
  )
}
