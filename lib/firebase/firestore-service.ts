import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
  increment,
  where
} from 'firebase/firestore'
import { db } from './config'

// Types
export interface GameProgressData {
  currentPhase: number
  currentMinigame: number
  completedPhases: number[]
  phaseScores: Record<number, number>
  totalScore: number
  lives: number
  unlockedBlocks: number[]
  streak: number
  lastPlayedDate: string | null
  updatedAt?: Timestamp
}

// Game Config - salvo no Firebase ao inves de localStorage
export interface GameConfigData {
  mode: 'historia' | 'pratica'
  difficulty: 'facil' | 'normal' | 'dificil'
  playerName: string
  firstVisitComplete: boolean
  updatedAt?: Timestamp
}

export interface UserProfileData {
  uid: string
  email: string | null
  displayName: string
  photoURL: string | null
  bio?: string
  username?: string
  createdAt: Timestamp
  lastLoginAt: Timestamp
  provider: 'email' | 'google'
  totalScore: number
  completedPhases: number[]
  currentPhase: number
  streak: number
  _r?: string // Hidden admin marker
}

export interface RankingEntry {
  uid: string
  displayName: string
  photoURL: string | null
  totalScore: number
  completedPhases: number
  streak: number
  position?: number
}

// User Progress Functions
export const getUserProgress = async (uid: string): Promise<GameProgressData | null> => {
  try {
    const progressRef = doc(db, 'users', uid, 'gameData', 'progress')
    const progressSnap = await getDoc(progressRef)

    if (progressSnap.exists()) {
      return progressSnap.data() as GameProgressData
    }
    return null
  } catch (error) {
    console.error('Error getting user progress:', error)
    return null
  }
}

export const saveUserProgress = async (uid: string, progress: GameProgressData): Promise<boolean> => {
  try {
    const progressRef = doc(db, 'users', uid, 'gameData', 'progress')
    await setDoc(progressRef, {
      ...progress,
      updatedAt: serverTimestamp()
    }, { merge: true })

    // Also update the main user document with summary data
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      totalScore: progress.totalScore,
      completedPhases: progress.completedPhases,
      currentPhase: progress.currentPhase,
      streak: progress.streak
    })

    return true
  } catch (error) {
    console.error('Error saving user progress:', error)
    return false
  }
}

// Game Config Functions - substituem localStorage
export const getGameConfig = async (uid: string): Promise<GameConfigData | null> => {
  try {
    const configRef = doc(db, 'users', uid, 'gameData', 'config')
    const configSnap = await getDoc(configRef)

    if (configSnap.exists()) {
      return configSnap.data() as GameConfigData
    }
    return null
  } catch (error) {
    console.error('Error getting game config:', error)
    return null
  }
}

export const saveGameConfig = async (uid: string, config: Omit<GameConfigData, 'updatedAt'>): Promise<boolean> => {
  try {
    const configRef = doc(db, 'users', uid, 'gameData', 'config')
    await setDoc(configRef, {
      ...config,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Error saving game config:', error)
    return false
  }
}

// Profile Functions
export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserProfileData
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Get public profile data for viewing other users
export interface PublicProfileData {
  uid: string
  displayName: string
  photoURL: string | null
  bio?: string
  totalScore: number
  completedPhases: number[]
  streak: number
  createdAt?: Date
}

export const getPublicProfile = async (uid: string): Promise<PublicProfileData | null> => {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        uid: data.uid || uid,
        displayName: data.displayName || 'Jogador',
        photoURL: data.photoURL || null,
        bio: data.bio,
        totalScore: data.totalScore || 0,
        completedPhases: data.completedPhases || [],
        streak: data.streak || 0,
        createdAt: data.createdAt?.toDate?.() || undefined
      }
    }
    return null
  } catch (error) {
    console.error('Error getting public profile:', error)
    return null
  }
}

export const updateUserProfile = async (
  uid: string,
  updates: Partial<Pick<UserProfileData, 'displayName' | 'bio' | 'photoURL'>>
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    return false
  }
}

// Ranking Functions
export const getGlobalRanking = async (limitCount: number = 50): Promise<RankingEntry[]> => {
  try {
    const usersRef = collection(db, 'users')
    const rankingQuery = query(
      usersRef,
      orderBy('totalScore', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(rankingQuery)
    const ranking: RankingEntry[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      ranking.push({
        uid: doc.id,
        displayName: data.displayName || 'Anonimo',
        photoURL: data.photoURL || null,
        totalScore: data.totalScore || 0,
        completedPhases: data.completedPhases?.length || 0,
        streak: data.streak || 0,
        position: ranking.length + 1
      })
    })

    return ranking
  } catch (error) {
    console.error('Error getting global ranking:', error)
    return []
  }
}

export const getUserRankingPosition = async (uid: string): Promise<number | null> => {
  try {
    const userProfile = await getUserProfile(uid)
    if (!userProfile) return null

    const usersRef = collection(db, 'users')
    const higherScoreQuery = query(
      usersRef,
      where('totalScore', '>', userProfile.totalScore)
    )

    const querySnapshot = await getDocs(higherScoreQuery)
    return querySnapshot.size + 1
  } catch (error) {
    console.error('Error getting user ranking position:', error)
    return null
  }
}

// Streak Functions
export const updateStreak = async (uid: string, newStreak: number, lastPlayedDate: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      streak: newStreak,
      lastPlayedDate
    })
    return true
  } catch (error) {
    console.error('Error updating streak:', error)
    return false
  }
}

// Score Functions
export const addScore = async (uid: string, scoreToAdd: number): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      totalScore: increment(scoreToAdd)
    })
    return true
  } catch (error) {
    console.error('Error adding score:', error)
    return false
  }
}

// Check if user is admin by email
export const checkIsAdmin = async (uid: string, email?: string | null): Promise<boolean> => {
  try {
    console.log('checkIsAdmin chamado com:', { uid, email })

    // Check by email in admin_emails collection
    if (email) {
      const docId = email.toLowerCase().replace(/[@.]/g, '_')
      console.log('Procurando documento com ID:', docId)

      const adminEmailRef = doc(db, 'admin_emails', docId)
      const adminSnap = await getDoc(adminEmailRef)
      console.log('Documento existe?', adminSnap.exists())

      if (adminSnap.exists()) {
        return true
      }
    }
    
    // Also check _r field in user profile (legacy)
    const userProfile = await getUserProfile(uid)
    console.log('Campo _r do perfil:', userProfile?._r)
    return userProfile?._r === 'a'
  } catch (error) {
    console.error('Erro em checkIsAdmin:', error)
    return false
  }
}

// Character Data Types and Functions
export type CharacterEmotion = 'neutral' | 'happy' | 'angry' | 'surprised' | 'thinking' | 'worried' | 'evil' | 'determined'

export interface CharacterData {
  id: 'detetive' | 'drCell' | 'fragmentado'
  name: string
  description: string
  images: Partial<Record<CharacterEmotion, string>>
  updatedAt?: Timestamp
}

export const DEFAULT_CHARACTERS: CharacterData[] = [
  {
    id: 'detetive',
    name: 'Detetive',
    description: 'O protagonista que busca conhecimento',
    images: {}
  },
  {
    id: 'drCell',
    name: 'Dr. Cell',
    description: 'Mentor que ensina citologia',
    images: {}
  },
  {
    id: 'fragmentado',
    name: 'Fragmentado',
    description: 'Vilao que desafia e provoca o jogador',
    images: {}
  }
]

// Get all characters
export const getCharacters = async (): Promise<CharacterData[]> => {
  try {
    const charactersRef = collection(db, 'characters')
    const querySnapshot = await getDocs(charactersRef)
    
    if (querySnapshot.empty) {
      // Return defaults if no characters in DB
      return DEFAULT_CHARACTERS
    }
    
    const characters: CharacterData[] = []
    querySnapshot.forEach((doc) => {
      characters.push({ id: doc.id, ...doc.data() } as CharacterData)
    })
    
    // Merge with defaults to ensure all characters exist
    return DEFAULT_CHARACTERS.map(defaultChar => {
      const dbChar = characters.find(c => c.id === defaultChar.id)
      return dbChar || defaultChar
    })
  } catch (error) {
    console.error('Error getting characters:', error)
    return DEFAULT_CHARACTERS
  }
}

// Get single character
export const getCharacter = async (characterId: string): Promise<CharacterData | null> => {
  try {
    const charRef = doc(db, 'characters', characterId)
    const charSnap = await getDoc(charRef)
    
    if (charSnap.exists()) {
      return { id: charSnap.id, ...charSnap.data() } as CharacterData
    }
    
    // Return default if not in DB
    return DEFAULT_CHARACTERS.find(c => c.id === characterId) || null
  } catch (error) {
    console.error('Error getting character:', error)
    return DEFAULT_CHARACTERS.find(c => c.id === characterId) || null
  }
}

// Save character (admin only)
export const saveCharacter = async (
  adminUid: string, 
  adminEmail: string | null,
  character: CharacterData
): Promise<boolean> => {
  const isAdmin = await checkIsAdmin(adminUid, adminEmail)
  if (!isAdmin) {
    console.error('User is not admin')
    return false
  }
  
  try {
    const charRef = doc(db, 'characters', character.id)
    await setDoc(charRef, {
      ...character,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Error saving character:', error)
    return false
  }
}

// Update character image for specific emotion
export const updateCharacterImage = async (
  adminUid: string,
  adminEmail: string | null,
  characterId: string,
  emotion: CharacterEmotion,
  imageUrl: string
): Promise<boolean> => {
  const isAdmin = await checkIsAdmin(adminUid, adminEmail)
  if (!isAdmin) {
    console.error('User is not admin')
    return false
  }
  
  try {
    const charRef = doc(db, 'characters', characterId)
    await setDoc(charRef, {
      [`images.${emotion}`]: imageUrl,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Error updating character image:', error)
    return false
  }
}

// Admin Functions (only work for admin users)
export const getAllUsers = async (adminUid: string): Promise<UserProfileData[]> => {
  const isAdmin = await checkIsAdmin(adminUid)
  if (!isAdmin) return []

  try {
    const usersRef = collection(db, 'users')
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'), limit(100))
    const querySnapshot = await getDocs(usersQuery)

    const users: UserProfileData[] = []
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() } as UserProfileData)
    })

    return users
  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
}

// Reviews / Testimonials Types and Functions
export interface ReviewData {
  id?: string
  name: string
  role: string
  photoUrl?: string
  rating: number // 1-5
  text: string
  isApproved: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Get approved reviews for public display
export const getApprovedReviews = async (): Promise<ReviewData[]> => {
  try {
    const reviewsRef = collection(db, 'reviews')
    const reviewsQuery = query(
      reviewsRef,
      where('isApproved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const querySnapshot = await getDocs(reviewsQuery)
    
    const reviews: ReviewData[] = []
    querySnapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as ReviewData)
    })
    
    return reviews
  } catch (error) {
    console.error('Error getting approved reviews:', error)
    return []
  }
}

// Get all reviews (admin only)
export const getAllReviews = async (adminUid: string, adminEmail?: string | null): Promise<ReviewData[]> => {
  const isAdmin = await checkIsAdmin(adminUid, adminEmail)
  if (!isAdmin) return []

  try {
    const reviewsRef = collection(db, 'reviews')
    const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(reviewsQuery)
    
    const reviews: ReviewData[] = []
    querySnapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as ReviewData)
    })
    
    return reviews
  } catch (error) {
    console.error('Error getting all reviews:', error)
    return []
  }
}

// Create review (admin only)
export const createReview = async (
  adminUid: string,
  adminEmail: string | null,
  review: Omit<ReviewData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string | null> => {
  const isAdmin = await checkIsAdmin(adminUid, adminEmail)
  if (!isAdmin) {
    console.error('User is not admin')
    return null
  }
  
  try {
    const reviewsRef = collection(db, 'reviews')
    const newReviewRef = doc(reviewsRef)
    await setDoc(newReviewRef, {
      ...review,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return newReviewRef.id
  } catch (error) {
    console.error('Error creating review:', error)
    return null
  }
}

// Update review (admin only)
export const updateReview = async (
  adminUid: string,
  adminEmail: string | null,
  reviewId: string,
  updates: Partial<Omit<ReviewData, 'id' | 'createdAt'>>
): Promise<boolean> => {
  const isAdmin = await checkIsAdmin(adminUid, adminEmail)
  if (!isAdmin) {
    console.error('User is not admin')
    return false
  }
  
  try {
    const reviewRef = doc(db, 'reviews', reviewId)
    await updateDoc(reviewRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating review:', error)
    return false
  }
}

// Delete review (admin only)
export const deleteReview = async (
  adminUid: string,
  adminEmail: string | null,
  reviewId: string
): Promise<boolean> => {
  const isAdmin = await checkIsAdmin(adminUid, adminEmail)
  if (!isAdmin) {
    console.error('User is not admin')
    return false
  }
  
  try {
    const { deleteDoc: firebaseDeleteDoc } = await import('firebase/firestore')
    const reviewRef = doc(db, 'reviews', reviewId)
    await firebaseDeleteDoc(reviewRef)
    return true
  } catch (error) {
    console.error('Error deleting review:', error)
    return false
  }
}

// Toggle review approval (admin only)
export const toggleReviewApproval = async (
  adminUid: string,
  adminEmail: string | null,
  reviewId: string,
  isApproved: boolean
): Promise<boolean> => {
  return updateReview(adminUid, adminEmail, reviewId, { isApproved })
}
