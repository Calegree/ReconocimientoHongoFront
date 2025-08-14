<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <header class="border-b bg-card p-4">
      <h1 class="text-2xl font-bold text-center">Reconocimiento Morchella</h1>
      <p class="text-sm text-muted-foreground text-center mt-1">
        Sistema de IA para identificación de hongos
      </p>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 pb-20">
      <component :is="currentComponent" />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t">
      <div class="flex justify-around items-center py-2">
        <button
          :class="[
            'flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-md transition-colors',
            activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
          ]"
          @click="setActiveTab('dashboard')"
        >
          <BarChart3Icon class="h-5 w-5" />
          <span class="text-xs">Dashboard</span>
        </button>

        <button
          :class="[
            'flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-md transition-colors',
            activeTab === 'recognition' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
          ]"
          @click="setActiveTab('recognition')"
        >
          <CameraIcon class="h-5 w-5" />
          <span class="text-xs">Reconocer</span>
        </button>

        <button
          :class="[
            'flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-md transition-colors',
            activeTab === 'model' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
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
.bg-background {
  background-color: #ffffff;
}

.bg-card {
  background-color: #ffffff;
}

.border-b {
  border-bottom: 1px solid #e5e7eb;
}

.border-t {
  border-top: 1px solid #e5e7eb;
}

.bg-primary {
  background-color: #3b82f6;
}

.text-primary-foreground {
  color: #ffffff;
}

.bg-muted {
  background-color: #f3f4f6;
}

.hover\:bg-muted:hover {
  background-color: #f3f4f6;
}

.text-muted-foreground {
  color: #6b7280;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
</style>
