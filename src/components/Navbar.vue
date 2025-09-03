<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { Camera, History } from 'lucide-vue-next'
import { ref } from 'vue'

const route = useRoute()
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 border-t border-border shadow-lg z-50" style="background-color: #8B6E45;">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-around h-16">
        <!-- Enlaces de navegación centrados -->
        <RouterLink
          to="/"
          class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
          :class="route.name === 'recognition' 
            ? 'text-white font-medium' 
            : 'text-white/80 hover:text-white'"
        >
          <Camera class="w-5 h-5" />
          <span class="text-xs">Reconocimiento</span>
        </RouterLink>
        
        <RouterLink
          to="/history"
          class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
          :class="route.name === 'history' 
            ? 'text-white font-medium' 
            : 'text-white/80 hover:text-white'"
        >
          <History class="w-5 h-5" />
          <span class="text-xs">Historial</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>
