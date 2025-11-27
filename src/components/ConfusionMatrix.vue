<script setup>
// Lógica del componente
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import { toRaw } from 'vue'

const props = defineProps({
  counts: {
    type: Object,
    default: () => ({ morchella: 20, no_morchella: 70 })
  }
})

const chartCanvas = ref(null) // canvas en el dom
let pieChart = null // almacena el grafico
const confusionImageUrl = ref(null)

function createOrUpdateChart(counts) {
  const dataVals = [Number(counts.morchella || 0), Number(counts.no_morchella || 0)]
  if (!chartCanvas.value) return
  const ctx = chartCanvas.value.getContext('2d')
  if (pieChart) {
    pieChart.data.datasets[0].data = dataVals
    pieChart.update()
    return
  }
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Morchella', 'No Morchella'],
      datasets: [
        {
          data: dataVals,
          backgroundColor: ['#d4af37', '#8d6a00'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 14 } } },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0'
              return `${label}: ${value} (${percentage}%)`
            },
          },
        },
      },
    },
  })
}

onMounted(() => {
  createOrUpdateChart(props.counts)
  // intenta obtener la imagen de la matriz de confusión del backend
  fetch('/api/mlflow/confusion_matrix_current')
    .then(async (res) => {
      if (!res.ok) throw new Error('no image')
      const blob = await res.blob()
      confusionImageUrl.value = URL.createObjectURL(blob)
    })
    .catch(() => {
      confusionImageUrl.value = null
    })
})

watch(() => toRaw(props.counts), (nv) => {
  createOrUpdateChart(nv)
}, { deep: true })
</script>

<template>
  <!-- HTML del componente -->
  <div class="space-y-6">
    <!-- Matriz de Confusión -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Matriz de Confusión</h3>

      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <!-- mantengo los contadores visuales usando props -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Verdaderos Positivos:</span>
            <span class="text-gray-500">Morchella +70% confianza</span>
          </div>
          <span class="text-gray-900 font-medium">{{ counts.morchella_true || 0 }}</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Falsos Positivos:</span>
            <span class="text-gray-500">Morchella -70% confianza</span>
          </div>
          <span class="text-gray-900 font-medium">{{ counts.false_positive || 0 }}</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Falsos Negativos:</span>
            <span class="text-gray-500">No Morchella -70% confianza</span>
          </div>
          <div class="bg-black text-white px-3 py-1 rounded text-sm font-medium">{{ counts.false_negative || 0 }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Verdaderos Negativos:</span>
            <span class="text-gray-500">No Morchella +70% confianza</span>
          </div>
          <div class="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">{{ counts.no_morchella_true || 0 }}</div>
        </div>
      </div>

      <!-- Métricas de Rendimiento (puedes completar con datos reales si los traes del backend) -->
      <div class="space-y-3">
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-gray-700">Precisión</span>
          <span class="text-sm font-medium text-gray-700">{{ counts.precision || 'N/A' }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-gray-800 h-2.5 rounded-full" :style="{ width: (counts.precision ? counts.precision : 0) + '%' }"></div>
        </div>
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-gray-700">Recall (Sensibilidad)</span>
          <span class="text-sm font-medium text-gray-700">{{ counts.recall || 'N/A' }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-gray-800 h-2.5 rounded-full" :style="{ width: (counts.recall ? counts.recall : 0) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Distribución de Reconocimientos con Pie Chart -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Distribución de Reconocimientos</h3>

      <div class="relative h-64 w-full">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Resumen de datos debajo del chart -->
      <div class="grid sm:grid-cols-2 gap-4 mt-4 text-center">
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-2xl font-bold text-gray-900">{{ counts.morchella || 0 }}</div>
          <div class="text-sm text-gray-600">Morchella</div>
          <div class="text-xs text-gray-500">
            {{ ((counts.morchella||0) + (counts.no_morchella||0)) ? ((counts.morchella||0) / ((counts.morchella||0)+(counts.no_morchella||0)) * 100).toFixed(1) + '%' : '0.0%' }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-2xl font-bold text-gray-900">{{ counts.no_morchella || 0 }}</div>
          <div class="text-sm text-gray-600">No Morchella</div>
          <div class="text-xs text-gray-500">
            {{ ((counts.morchella||0) + (counts.no_morchella||0)) ? ((counts.no_morchella||0) / ((counts.morchella||0)+(counts.no_morchella||0)) * 100).toFixed(1) + '%' : '0.0%' }}
          </div>
        </div>
      </div>

      <div v-if="confusionImageUrl" class="mt-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Matriz (detalle)</h4>
        <img :src="confusionImageUrl" alt="confusion matrix" class="w-full object-contain rounded" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>
