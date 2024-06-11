<template lang="">
  <header>
    <div class="container header_container">
      <div class="logo">
        <router-link :to="{ name: 'Home' }">GameSource</router-link>
      </div>
      <div>
        <ul>
          <li v-if="!userStore.auth">
            <router-link :to="{ name: 'Login' }">Sign in</router-link>
          </li>
          <span v-if="userStore.auth">
            <li @click="userStore.logout">
              <span>Logout</span>
            </li>
            <li>
              <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
            </li>
          </span>
        </ul>
      </div>
    </div>
  </header>
</template>
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
<style lang=""></style>
