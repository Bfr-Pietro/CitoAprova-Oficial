import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCnJgRd5pvQ7uon8-7RWd3FEnnpoMQ_i5E",
  authDomain: "citoaprova-ps.firebaseapp.com",
  projectId: "citoaprova-ps",
  storageBucket: "citoaprova-ps.firebasestorage.app",
  messagingSenderId: "575923709801",
  appId: "1:575923709801:web:2a0f572bbe9741b6fdbff8",
  measurementId: "G-XV6F7WMKVY"
}

// Initialize Firebase (prevent multiple initializations)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Analytics (only on client side)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported()
    if (supported) {
      return getAnalytics(app)
    }
  }
  return null
}

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export default app
