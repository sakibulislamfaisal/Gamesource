import router from '@/router'
import { defineStore } from 'pinia'

// TOASTS
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

// FIREBASE
import errorCodes from '@/utils/fbcodes'
import { AUTH, DB } from '@/utils/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const DEFAULT_USER = {
  uid: null,
  email: null,
  firstname: null,
  lastname: null,
  isAdmin: null
}

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    user: DEFAULT_USER,
    auth: false
  }),
  getters: {
    getUserData(state) {
      return state.user
    },
    getUserId(state) {
      return state.user.uid
    }
  },
  actions: {
    //user set into local state
    setUser(user) {
      this.user = { ...this.user, ...user }
      this.auth = true
    },
    async updateProfile(formData) {
      try {
        const userRef = doc(DB, 'users', this.getUserId)
        await updateDoc(userRef, {
          ...formData
        })

        this.setUser(formData)
        $toast.success('Updated !!!')
        return true
      } catch (error) {
        $toast.error(error.message)
      }
    },
    async logout() {
      await signOut(AUTH)
      this.user = DEFAULT_USER
      this.auth = false
      router.push({ name: 'Login' })
    },
    async register(formData) {
      try {
        this.loading = true

        //REGISTER USER
        const response = await createUserWithEmailAndPassword(
          AUTH,
          formData.email,
          formData.password
        )

        // ADD USER TO DB
        const newUser = {
          uid: response.user.uid,
          email: response.user.email,
          isAdmin: false
        }

        //set all the user
        await setDoc(doc(DB, 'users', response.user.uid), newUser)

        /// UPDATE LOCAL STATE
        this.setUser(newUser)

        // REDIRECT USER
        router.push({ name: 'Dashboard' })
      } catch (error) {
        throw new Error(errorCodes(error.code))
      } finally {
        this.loading = false
      }
    },
    async autosignin(uid) {
      try {
        const userData = await this.getUserProfile(uid)
        /// UPDATE LOCAL STATE
        this.setUser(userData)
        return true
      } catch (error) {
        console.log(error)
      }
    },
    async getUserProfile(uid) {
      try {
        const userRef = await getDoc(doc(DB, 'users', uid))
        if (!userRef.exists()) {
          throw new Error('Could not find user !!')
        }
        return userRef.data()
      } catch (error) {
        throw new Error(error)
      }
    },
    async Login(formData) {
      try {
        this.loading = true

        /// SIGN IN USER
        const response = await signInWithEmailAndPassword(AUTH, formData.email, formData.password)
        //console.log(response.data)
        /// GET USER DATA
        const userData = await this.getUserProfile(response.user.uid)

        /// UPDATE LOCAL STATE
        this.setUser(userData)

        // REDIRECT USER
        router.push({ name: 'Dashboard' })
      } catch (error) {
        throw new Error(errorCodes(error.code))
      } finally {
        this.loading = false
      }
    }
  }
})
