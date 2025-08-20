<script setup>
// Lógica del componente
import Title from '../components/Title.vue'
import NavBar from '../components/NavBar.vue'
import TextBox from '@/components/TextBox.vue'
import { Activity, TrendingUp, Target } from 'lucide-vue-next'

// Datos dinámicos
const metricas = [
  {
    title: 'Reconocimientos totales',
    icon: Activity,
    percentage: 90,
  },
  {
    title: 'Precisión del Modelo',
    icon: Target,
    percentage: '45.0%',
  },
  {
    title: 'F1-Score',
    icon: TrendingUp,
    percentage: '26.7%',
  },
]
</script>

<template>
  <!-- HTML del componente -->
  <Title />
  <div class="flex flex-row">
    <TextBox
      v-for="metrica in metricas"
      :key="metrica.title"
      :title="metrica.title"
      :icon="metrica.icon"
      :percentage="metrica.percentage"
    />
  </div>

  <NavBar />
</template>

<style scoped>
/* Estilos del componente */
</style>
