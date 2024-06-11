import Home from '@/components/Home/Home.vue'
import { isAuth, isLoggedIn } from '@/composables/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/article/:id',
      name: 'Article',
      component: () => import('@/components/Article/Article.vue')
    },
    {
      path: '/login',
      name: 'Login',
      beforeEnter: isLoggedIn,
      component: () => import('@/components/User/Login.vue')
    },
    {
      path: '/user/dashboard',
      beforeEnter: isAuth,
      component: () => import('@/components/User/Dashboard/Dashboard.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/components/User/Dashboard/DashboardMain.vue')
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/components/User/pages/UserProfile.vue')
        },
        {
          path: 'admin/add-article',
          name: 'AddArticle',
          component: () => import('@/components/User/admin/AddArticle.vue')
        },
        {
          path: 'admin/article',
          name: 'Articles',
          component: () => import('@/components/User/admin/Articles.vue')
        },
        {
          path: 'admin/edit-article/:id',
          name: 'EditArticle',
          component: () => import('@/components/User/admin/EditArticle.vue')
        },
        {
          path: '/:notFound(.*)*',
          component: () => import('@/components/NotFound.vue'),
          name: '404'
        }
      ]
    }
  ]
})

export default router
