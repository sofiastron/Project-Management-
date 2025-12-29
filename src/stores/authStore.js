import { defineStore } from 'pinia'
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { getFirestore, doc, setDoc } from "firebase/firestore"

const db = getFirestore()

async function saveUserToFirestore(user) {
  if (!user) return

  const userRef = doc(db, "users", user.uid)

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    createdAt: new Date().toISOString(),
  }, { merge: true })  
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async register(email, password) {
      this.loading = true
      this.error = null
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        
        await saveUserToFirestore(this.user)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        
        await saveUserToFirestore(this.user)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    init() {
      this.loading = true
      onAuthStateChanged(auth, async (user) => {
        this.user = user
        if (user) {
          await saveUserToFirestore(user)
        }
        this.loading = false
      })
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user
  }
})
