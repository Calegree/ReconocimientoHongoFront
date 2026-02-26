<script setup>
// Lógica del componente
import Title from '../components/Title.vue'
import NavBar from '../components/NavBar.vue'
import TextBox from '@/components/TextBox.vue'
import ConfusionMatrix from '@/components/ConfusionMatrix.vue'
import { Activity, TrendingUp, Target } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const counts = ref({ morchella: 20, no_morchella: 70 }) // default
// Datos dinámicos
const metricas = computed(() => [
  {
    title: 'Reconocimientos totales',
    icon: Activity,
    percentage: (counts.value?.morchella || 0) + (counts.value?.no_morchella || 0)
  }
  //{ title: 'Precisión del Modelo', icon: Target, percentage: '45.0%' },
  //{ title: 'F1-Score', icon: TrendingUp, percentage: '26.7%' },
])
onMounted(async () => {
  try {
    // Usamos el proxy de Vite -> /api/* => http://localhost:5000/*
    const res = await axios.get('/api/dashboard/prediction_counts', { timeout: 5000 })
    // Mostrar la respuesta en consola como solicitaste
    console.log('GET /dashboard/prediction_counts response:', res)
    // res.data contiene el JSON devuelto por el servidor
    if (res && res.data) counts.value = res.data
  } catch (e) {
    console.warn('no se pudieron obtener prediction_counts', e)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f5e6c8]">
    <div class="flex-1 flex items-center justify-center px-4 py-8">
      <div class="bg-white p-10 pt-12 rounded-xl border border-gray-200 shadow-lg w-full max-w-4xl overflow-visible">
        <h2 class="text-center text-xl font-bold text-gold-900 mb-6">Resumen del Sistema</h2>

<!--       <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-6"> --> 
          <div v-for="metrica in metricas" :key="metrica.title" class="metric-wrapper">
            <TextBox class="w-full h-full" :title="metrica.title" :icon="metrica.icon" :percentage="metrica.percentage" />
          </div>

      <!--   </div>--> 

        <div class="mt-6 text-gold-900">
          <!----><ConfusionMatrix :counts="counts" />
        </div>
      </div>
    </div>

    <NavBar class="fixed left-0 right-0 bottom-0 z-50" />
  </div>
</template>

<style scoped>
/* Colores dorados personalizados (coinciden con las otras vistas) */
.text-gold-900 { color: #8d6a00; }
.text-gold-700 { color: #bfa14a; }
.text-gold-500 { color: #d4af37; }
.border-gold-300 { border-color: #d4af37; }
.bg-gold-50 { background: #f5e6c8; }

/* Evitar que elementos internos de TextBox se salgan y se solapen entre columnas */
.metric-wrapper {
  padding: 0.5rem;       /* separación entre tarjetas */
  min-height: 6.5rem;    /* asegura altura mínima para evitar colapsos */
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 0;
}

/* Forzar que el componente TextBox ocupe todo el espacio del wrapper
   y quede por encima de cualquier elemento decorativo fuera del wrapper */
.metric-wrapper > * {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  overflow: hidden; /* recorta cualquier pseudo-elemento que pueda salir */
  --text-color: #8d6a00;
  --icon-color: #bfa14a;
  color: var(--text-color);
}

/* Si TextBox usa sombras o elementos absolutamente posicionados, esto evita que se superpongan
   con vecinos y mantiene separación visual. */

/* Estilos para los componentes hijos (ConfusionMatrix) */
:deep(.progress-bar) {
  background-color: #8d6a00 !important;
}

:deep(.pie-chart-morchella),
:deep(.recharts-pie-sector:first-of-type path) {
  fill: #8d6a00 !important; /* dorado oscuro */
}

:deep(.pie-chart-no-morchella),
:deep(.recharts-pie-sector:last-of-type path) {
  fill: #bfa14a !important; /* dorado claro */
}
</style>
