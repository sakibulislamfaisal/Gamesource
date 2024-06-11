import router from '@/router'
import { useUserStore } from '@/stores/user'
import { defineStore } from 'pinia'

/// FIREBASE
import { DB } from '@/utils/firebase'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc
} from 'firebase/firestore'

// TOASTS
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

let articlesCol = collection(DB, 'articles')

export const useArticleStore = defineStore('article', {
  state: () => ({
    homeArticles: '',
    adminArticles: '',
    adminLastVisible: ''
  }),
  getters: {
    getHomeArticles(state) {
      return state.homeArticles
    },
    getFeaturesSlides(state) {
      return state.homeArticles.slice(0, 2)
    }
  },
  actions: {
    async getArticles(docsLimit) {
      try {
        const q = query(articlesCol, orderBy('timestamp', 'desc'), limit(docsLimit))
        const querySnapshot = await getDocs(q)
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        this.homeArticles = articles
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateArticle(id, formData) {
      try {
        const docRef = doc(DB, 'articles', id)
        await updateDoc(docRef, {
          ...formData
        })
        /// SHOW TOASTS
        $toast.success('Updated !!')
        return true
      } catch (error) {
        $toast.success(error.message)
        throw new Error(error)
      }
    },
    async getArticleById(id) {
      try {
        const docRef = await getDoc(doc(DB, 'articles', id))
        if (!docRef.exists()) {
          throw new Error('Could not find document')
        }
        return docRef.data()
      } catch (error) {
        router.push({ name: '404' })
      }
    },
    async addArticle(formData) {
      try {
        // GET USER PROFILE
        const userStore = useUserStore()
        const user = userStore.getUserData
        // POST DOC IN DB
        const newArticle = doc(articlesCol)
        await setDoc(newArticle, {
          timestamp: serverTimestamp(),
          owner: {
            uid: user.uid,
            firstname: user.firstname,
            lastname: user.lastname
          },
          ...formData
        })
        // REDIRECT USER
        router.push({ name: 'Articles', query: { reload: true } })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
    async adminGetArticles(docLimit) {
      try {
        const q = query(articlesCol, orderBy('timestamp', 'desc'), limit(docLimit))
        const querySnapshot = await getDocs(q)

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        const articles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        /// UPDATE ADMIN ARTICLES STATE
        this.adminArticles = articles
        this.adminLastVisible = lastVisible
      } catch (error) {
        $toast.success(error.message)
        throw new Error(error)
      }
    },
    async adminGetMoreArticles(docLimit) {
      try {
        if (this.adminLastVisible) {
          let oldArticles = this.adminArticles

          const q = query(
            articlesCol,
            orderBy('timestamp', 'desc'),
            startAfter(this.adminLastVisible),
            limit(docLimit)
          )
          const querySnapshot = await getDocs(q)
          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          const newArticles = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))

          this.adminArticles = [...oldArticles, ...newArticles]
          this.adminLastVisible = lastVisible
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeById(articleID) {
      try {
        await deleteDoc(doc(DB, 'articles', articleID))

        const newList = this.adminArticles.filter((x) => {
          return x.id != articleID
        })

        this.adminArticles = newList
        /// SHOW TOASTS
        $toast.success('Removed !!')
      } catch (error) {
        $toast.error(error.message)
        throw new Error(error)
      }
    }
  }
})
