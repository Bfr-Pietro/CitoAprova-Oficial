'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import {
  onAuthChange,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout as firebaseLogout,
  resetPassword,
  UserProfile
} from '@/lib/firebase/auth-service'
import {
  getUserProfile,
  updateUserProfile,
  checkIsAdmin,
  UserProfileData
} from '@/lib/firebase/firestore-service'

export interface User {
  id: string
  name: string
  email: string
  photoURL?: string | null
  createdAt: string
  provider?: 'email' | 'google'
  bio?: string
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (updates: Partial<Pick<User, 'name' | 'bio' | 'photoURL'>>) => Promise<boolean>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Convert Firebase profile to User interface
const profileToUser = (profile: UserProfile | UserProfileData): User => ({
  id: profile.uid,
  name: profile.displayName || 'Usuario',
  email: profile.email || '',
  photoURL: profile.photoURL,
  createdAt: 'createdAt' in profile && profile.createdAt
    ? (profile.createdAt instanceof Date ? profile.createdAt.toISOString() : profile.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString())
    : new Date().toISOString(),
  provider: profile.provider,
  bio: 'bio' in profile ? profile.bio : undefined
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser)

      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid)
          if (profile) {
            setUser(profileToUser(profile))
            // Check admin status by email
            const adminStatus = await checkIsAdmin(fbUser.uid, fbUser.email)
            setIsAdmin(adminStatus)
          } else {
            // Fallback if profile doesn't exist yet
            setUser({
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario',
              email: fbUser.email || '',
              photoURL: fbUser.photoURL,
              createdAt: new Date().toISOString()
            })
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Login with email
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await loginWithEmail(email, password)
      
      if (result.error) {
        return { success: false, error: result.error }
      }

      setUser(profileToUser(result.user))
      return { success: true }
    } catch {
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' }
    }
  }, [])

  // Login with Google
  const handleGoogleLogin = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await loginWithGoogle()
      
      if (result.error) {
        return { success: false, error: result.error }
      }

      setUser(profileToUser(result.user))
      return { success: true }
    } catch {
      return { success: false, error: 'Erro ao fazer login com Google. Tente novamente.' }
    }
  }, [])

  // Register
  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await registerWithEmail(email, password, name)
      
      if (result.error) {
        return { success: false, error: result.error }
      }

      setUser(profileToUser(result.user))
      return { success: true }
    } catch {
      return { success: false, error: 'Erro ao criar conta. Tente novamente.' }
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    await firebaseLogout()
    setUser(null)
    setIsAdmin(false)
  }, [])

  // Update user profile
  const updateUser = useCallback(async (updates: Partial<Pick<User, 'name' | 'bio' | 'photoURL'>>): Promise<boolean> => {
    if (!firebaseUser) return false

    const firestoreUpdates: Partial<Pick<UserProfileData, 'displayName' | 'bio' | 'photoURL'>> = {}
    if (updates.name) firestoreUpdates.displayName = updates.name
    if (updates.bio !== undefined) firestoreUpdates.bio = updates.bio
    if (updates.photoURL !== undefined) firestoreUpdates.photoURL = updates.photoURL

    const success = await updateUserProfile(firebaseUser.uid, firestoreUpdates)
    
    if (success && user) {
      setUser({ ...user, ...updates })
    }
    
    return success
  }, [firebaseUser, user])

  // Reset password
  const handleResetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    return await resetPassword(email)
  }, [])

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    loginWithGoogle: handleGoogleLogin,
    register,
    logout,
    updateUser,
    resetPassword: handleResetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
