import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date | null
  lastLoginAt: Date | null
  provider: 'email' | 'google'
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Helper to check admin status (secure - only checks in Firestore)
const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, '_system_config', 'admin_users'))
    if (adminDoc.exists()) {
      const data = adminDoc.data()
      return data?.users?.includes(uid) || false
    }
    return false
  } catch {
    return false
  }
}

// Create or update user profile in Firestore
const createOrUpdateUserProfile = async (
  user: FirebaseUser,
  provider: 'email' | 'google',
  additionalData?: { displayName?: string }
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  const isAdmin = await checkAdminStatus(user.uid)

  if (!userSnap.exists()) {
    // Create new profile
    const newProfile = {
      uid: user.uid,
      email: user.email,
      displayName: additionalData?.displayName || user.displayName || user.email?.split('@')[0] || 'Usuario',
      photoURL: user.photoURL,
      provider,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      // Game progress fields
      totalScore: 0,
      completedPhases: [],
      currentPhase: 1,
      streak: 0,
      ...(isAdmin && { _r: 'a' }) // Hidden admin marker
    }

    await setDoc(userRef, newProfile)

    return {
      uid: user.uid,
      email: user.email,
      displayName: newProfile.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      provider
    }
  } else {
    // Update last login
    await setDoc(userRef, { 
      lastLoginAt: serverTimestamp(),
      ...(isAdmin && { _r: 'a' })
    }, { merge: true })

    const data = userSnap.data()
    return {
      uid: user.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || null,
      lastLoginAt: new Date(),
      provider: data.provider
    }
  }
}

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ user: UserProfile; error?: string }> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update display name
    await updateProfile(userCredential.user, { displayName })
    
    const profile = await createOrUpdateUserProfile(userCredential.user, 'email', { displayName })
    
    return { user: profile }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    let errorMessage = 'Erro ao criar conta. Tente novamente.'
    
    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ja esta cadastrado.'
        break
      case 'auth/invalid-email':
        errorMessage = 'Email invalido.'
        break
      case 'auth/weak-password':
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
        break
    }
    
    return { user: null as unknown as UserProfile, error: errorMessage }
  }
}

// Login with email and password
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ user: UserProfile; error?: string }> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const profile = await createOrUpdateUserProfile(userCredential.user, 'email')
    
    return { user: profile }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    let errorMessage = 'Erro ao fazer login. Tente novamente.'
    
    switch (firebaseError.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage = 'Email ou senha incorretos.'
        break
      case 'auth/invalid-email':
        errorMessage = 'Email invalido.'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.'
        break
    }
    
    return { user: null as unknown as UserProfile, error: errorMessage }
  }
}

// Login with Google
export const loginWithGoogle = async (): Promise<{ user: UserProfile; error?: string }> => {
  try {
    const userCredential: UserCredential = await signInWithPopup(auth, googleProvider)
    const profile = await createOrUpdateUserProfile(userCredential.user, 'google')
    
    return { user: profile }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    let errorMessage = 'Erro ao fazer login com Google. Tente novamente.'
    
    switch (firebaseError.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Login cancelado.'
        break
      case 'auth/popup-blocked':
        errorMessage = 'Pop-up bloqueado. Permita pop-ups para este site.'
        break
    }
    
    return { user: null as unknown as UserProfile, error: errorMessage }
  }
}

// Logout
export const logout = async (): Promise<void> => {
  await signOut(auth)
}

// Send password reset email
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string }
    let errorMessage = 'Erro ao enviar email de recuperacao.'
    
    if (firebaseError.code === 'auth/user-not-found') {
      errorMessage = 'Email nao cadastrado.'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Auth state observer
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser
}
