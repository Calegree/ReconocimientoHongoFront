<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <header class="border-b border-border bg-background p-4 shadow-sm">
      <h1 class="text-2xl font-bold text-center text-text">Reconocimiento Morchella</h1>
      <p class="text-sm text-text-deep text-center mt-1">
        Sistema de IA para identificación de hongos
      </p>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 pb-20">
      <component :is="currentComponent" />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg">
      <div class="flex justify-around items-center py-2">
        <button
          :class="[
            'flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-md transition-colors',
            activeTab === 'dashboard' ? 'bg-sand text-background shadow-md' : 'hover:bg-hover text-text',
          ]"
          @click="setActiveTab('dashboard')"
        >
          <BarChart3Icon class="h-5 w-5" />
          <span class="text-xs">Dashboard</span>
        </button>

        <button
          :class="[
            'flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-md transition-colors',
            activeTab === 'recognition' ? 'bg-sand text-background shadow-md' : 'hover:bg-hover text-text',
          ]"
          @click="setActiveTab('recognition')"
        >
          <CameraIcon class="h-5 w-5" />
          <span class="text-xs">Reconocer</span>
        </button>

        <button
          :class="[
            'flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-md transition-colors',
            activeTab === 'model' ? 'bg-sand text-background shadow-md' : 'hover:bg-hover text-text',
          ]"
          @click="setActiveTab('model')"
        >
          <SettingsIcon class="h-5 w-5" />
          <span class="text-xs">Modelo</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageRecognition from './ImageRecognition.vue'
import ModelUpload from './ModelUpload.vue'
import Dashboard from './Dashboard.vue'
import CameraIcon from './icons/CameraIcon.vue'
import BarChart3Icon from './icons/BarChart3Icon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'

const activeTab = ref('recognition')

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'recognition':
      return ImageRecognition
    case 'dashboard':
      return Dashboard
    case 'model':
      return ModelUpload
    default:
      return ImageRecognition
  }
})

const setActiveTab = (tab) => {
  activeTab.value = tab
}
</script>

<style scoped>
/* Actualizados con la nueva paleta de colores */
.bg-background {
  background-color: #E6D7B8;
}

.bg-sand {
  background-color: #C2A878;
}

.text-background {
  color: #E6D7B8;
}

.text-text {
  color: #5A4633;
}

.text-text-deep {
  color: #3B2C23;
}

.bg-hover {
  background-color: #8B6E45;
}

.hover\:bg-hover:hover {
  background-color: #8B6E45;
}

.border-border {
  border-color: #3B2C23;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
</style>
