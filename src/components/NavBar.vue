<script setup>
// Lógica del componente

import { RouterLink, useRoute } from 'vue-router'
import { ChartColumn } from 'lucide-vue-next'
import { Camera } from 'lucide-vue-next'
import { Dumbbell } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <!-- HTML del componente -->
  <nav class="fixed bottom-0 grid grid-cols-3 p-2 w-full bg-gray-100 p-2">
    <RouterLink to="/" class="flex flex-col items-center">
      <ChartColumn class="w-6 h-6 text-gray-700" />
      <h2 class="text-sm font-medium">Dashboard</h2>
    </RouterLink>
    <RouterLink to="/recognition" class="flex flex-col items-center">
      <Camera class="w-6 h-6 text-gray-700" />
      <h2 class="text-sm font-medium">Reconocimiento</h2>
    </RouterLink>
    <RouterLink to="/model-training" class="flex flex-col items-center">
      <Dumbbell class="w-6 h-6 text-gray-700" />
      <h2 class="text-sm font-medium">Modelo</h2>
    </RouterLink>
  </nav>
</template>

<style scoped>
/* Estilos del componente */
</style>
