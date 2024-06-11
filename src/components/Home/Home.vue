<template>
  <div class="container">
    <AppCarousel />
    <Featured />
  </div>
</template>

<script setup>
import AppCarousel from '@/components/Carousel.vue'
import Featured from '@/components/Home/Feature.vue'

/// ARTICLE STORE
import { useArticleStore } from '@/stores/articles'
const articleStore = useArticleStore()

if (!articleStore.homeArticles) {
  articleStore.getArticles(8)
}
</script>
