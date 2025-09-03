<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { computed } from 'vue'

const route = useRoute()

// Hide navbar on recognition route (camera view) and history route
const showNavbar = computed(() => route.name !== 'recognition' && route.name !== 'history')
</script>

<template>
  <div class="bg-background min-h-screen" :class="{ 'pb-20': showNavbar }">
    <RouterView />
    <Navbar v-if="showNavbar" />
  </div>
</template>