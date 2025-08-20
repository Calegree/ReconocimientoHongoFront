<script setup>
// Lógica del componente
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'

const chartCanvas = ref(null) // canvas en el dom
let pieChart = null // almacena el grafico

onMounted(() => {
  // Lógica para crear el gráfico cuando el componente se monta
  if (chartCanvas.value) {
    //para trabajar con el grafico se necesita darle contexto
    const ctx = chartCanvas.value.getContext('2d')
    //grafico de pie como tal
    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        //etiquetas de morchella y no morchella
        labels: ['Morchella', 'No Morchella'],
        datasets: [
          {
            //numero de morchellas y no morchellas identificados
            data: [20, 70],
            backgroundColor: [
              //colores del grafico
              '#000000', // Negro para Morchella
              '#9CA3AF', // Gris para No Morchella
            ],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true, // Se adapta al tamaño del contenedor
        maintainAspectRatio: false, // Permite cambiar la proporción
        plugins: {
          legend: {
            position: 'bottom', // Leyenda en la parte inferior
            labels: {
              padding: 20,
              usePointStyle: true, // Usa puntos en lugar de rectángulos
              font: {
                size: 14, // Tamaño de fuente
              },
            },
          },
          //muestra una pequeña ventana emergente al pasar el mouse
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || ''
                const value = context.parsed
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })
  }
})
</script>

<template>
  <!-- HTML del componente -->
  <div class="space-y-6">
    <!-- Matriz de Confusión -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Matriz de Confusión</h3>

      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Verdaderos Positivos:</span>
            <span class="text-gray-500">Morchella +70% confianza</span>
          </div>
          <span class="text-gray-900 font-medium">2</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Falsos Positivos:</span>
            <span class="text-gray-500">Morchella -70% confianza</span>
          </div>
          <span class="text-gray-900 font-medium">6</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Falsos Negativos:</span>
            <span class="text-gray-500">No Morchella -70% confianza</span>
          </div>
          <div class="bg-black text-white px-3 py-1 rounded text-sm font-medium">2</div>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-gray-700">Verdaderos Negativos:</span>
            <span class="text-gray-500">No Morchella +70% confianza</span>
          </div>
          <div class="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">7</div>
        </div>
      </div>

      <!-- Métricas de Rendimiento -->
      <div class="space-y-3">
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-gray-700">Precisión</span>
          <span class="text-sm font-medium text-gray-700">25%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-gray-800 h-2.5 rounded-full" style="width: 25%"></div>
        </div>
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-gray-700">Recall (Sensibilidad)</span>
          <span class="text-sm font-medium text-gray-700">28.6%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-gray-800 h-2.5 rounded-full" style="width: 28.6%"></div>
        </div>
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-gray-700">Exactitud</span>
          <span class="text-sm font-medium text-gray-700">45%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-gray-800 h-2.5 rounded-full" style="width: 45%"></div>
        </div>
      </div>
    </div>

    <!-- Distribución de Reconocimientos con Pie Chart -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Distribución de Reconocimientos</h3>

      <!-- Canvas para el pie chart no se puede usar si no se pone es el html del chart -->
      <div class="relative h-64 w-full">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Resumen de datos debajo del chart -->
      <div class="grid sm:grid-cols-2 gap-4 mt-4 text-center">
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-2xl font-bold text-gray-900">20</div>
          <div class="text-sm text-gray-600">Morchella</div>
          <div class="text-xs text-gray-500">22.2%</div>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-2xl font-bold text-gray-900">70</div>
          <div class="text-sm text-gray-600">No Morchella</div>
          <div class="text-xs text-gray-500">77.8%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>
