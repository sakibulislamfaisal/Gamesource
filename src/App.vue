<template>
  <div class="text-center" v-if="loading">
    <v-progress-circular indeterminate color="green" size="50" class="loader" />
  </div>
  <div v-else>
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from '@/components/Header/Header.vue'
import { firstLoad } from './composables/auth'

const { loading } = firstLoad()
</script>

<style scoped>
.v-progress-circular {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
