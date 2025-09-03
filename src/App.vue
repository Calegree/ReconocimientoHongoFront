<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="pb-20 bg-background min-h-screen">
    <RouterView />
    <Navbar />
  </div>
</template>