<template>
  <div class="max-w-4xl mx-auto space-y-6 flex flex-col justify-center min-h-[calc(100vh-200px)]">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="text-sm font-medium">Reconocimientos Totales</h3>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="text-2xl font-bold">{{ metrics.totalRecognitions }}</div>
        <p class="text-xs text-muted-foreground">+12% desde el mes pasado</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="text-sm font-medium">Precisión del Modelo</h3>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
        </div>
        <div class="text-2xl font-bold">{{ accuracy.toFixed(1) }}%</div>
        <p class="text-xs text-muted-foreground">Basado en matriz de confusión</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="text-sm font-medium">F1-Score</h3>
          <svg
            class="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <div class="text-2xl font-bold">{{ f1Score.toFixed(1) }}%</div>
        <p class="text-xs text-muted-foreground">Métrica balanceada</p>
      </div>
    </div>

    <!-- Confusion Matrix -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Matriz de Confusión</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm">Verdaderos Positivos:</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white"
              >
                {{ metrics.confusionMatrix.truePositives }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm">Falsos Positivos:</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {{ metrics.confusionMatrix.falsePositives }}
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm">Falsos Negativos:</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {{ metrics.confusionMatrix.falseNegatives }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm">Verdaderos Negativos:</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white"
              >
                {{ metrics.confusionMatrix.trueNegatives }}
              </span>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium">Precisión</span>
              <span class="text-sm">{{ precision.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-500"
                :style="{ width: precision + '%' }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium">Recall (Sensibilidad)</span>
              <span class="text-sm">{{ recall.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-500"
                :style="{ width: recall + '%' }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium">Exactitud</span>
              <span class="text-sm">{{ accuracy.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-500"
                :style="{ width: accuracy + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recognition Distribution -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Distribución de Reconocimientos</h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-primary rounded-full"></div>
              <span class="text-sm">Morchella</span>
            </div>
            <span class="font-medium">{{ metrics.morchella }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-muted rounded-full"></div>
              <span class="text-sm">No Morchella</span>
            </div>
            <span class="font-medium">{{ metrics.noMorchella }}</span>
          </div>

          <!-- Visual representation -->
          <div class="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              class="bg-primary h-full transition-all duration-500"
              :style="{ width: (metrics.morchella / metrics.totalRecognitions) * 100 + '%' }"
            ></div>
          </div>

          <div class="flex justify-between text-xs text-muted-foreground">
            <span
              >{{ ((metrics.morchella / metrics.totalRecognitions) * 100).toFixed(1) }}%
              Morchella</span
            >
            <span
              >{{ ((metrics.noMorchella / metrics.totalRecognitions) * 100).toFixed(1) }}% No
              Morchella</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Mock data - in real app, this would come from your analytics API
const metrics = {
  totalRecognitions: 90,
  morchella: 20,
  noMorchella: 70,
  confusionMatrix: {
    truePositives: 2,
    falsePositives: 6,
    falseNegatives: 5,
    trueNegatives: 7,
  },
}

const accuracy = computed(() => {
  return (
    ((metrics.confusionMatrix.truePositives + metrics.confusionMatrix.trueNegatives) /
      (metrics.confusionMatrix.truePositives +
        metrics.confusionMatrix.falsePositives +
        metrics.confusionMatrix.falseNegatives +
        metrics.confusionMatrix.trueNegatives)) *
    100
  )
})

const precision = computed(() => {
  return (
    (metrics.confusionMatrix.truePositives /
      (metrics.confusionMatrix.truePositives + metrics.confusionMatrix.falsePositives)) *
    100
  )
})

const recall = computed(() => {
  return (
    (metrics.confusionMatrix.truePositives /
      (metrics.confusionMatrix.truePositives + metrics.confusionMatrix.falseNegatives)) *
    100
  )
})

const f1Score = computed(() => {
  return (2 * (precision.value * recall.value)) / (precision.value + recall.value)
})
</script>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.bg-primary {
  background-color: #3b82f6;
}

.bg-muted {
  background-color: #f3f4f6;
}

.text-muted-foreground {
  color: #6b7280;
}

.transition-all {
  transition: all 0.5s ease-in-out;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.md\:grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
