import { defineStore } from 'pinia'
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"

const db = getFirestore()
const googleProvider = new GoogleAuthProvider()


async function saveUserToFirestore(user) {
  if (!user) return

  const userRef = doc(db, "users", user.uid)

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      createdAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
 
    async register(email, password) {
      this.loading = true
      this.error = null

      try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        this.user = res.user
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
        const res = await signInWithEmailAndPassword(auth, email, password)
        this.user = res.user
        await saveUserToFirestore(this.user)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },


    async loginWithGoogle() {
      this.loading = true
      this.error = null

      try {
        const res = await signInWithPopup(auth, googleProvider)
        this.user = res.user
        await saveUserToFirestore(this.user)
      } catch (err) {
        this.error = "Connexion Google échouée"
        console.error(err)
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
  }
})
