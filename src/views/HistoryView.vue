<script setup>
import { useHistoryStore } from '@/stores/history'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2, Calendar, BarChart3, AlertTriangle, X, ArrowLeft, Download, Upload } from 'lucide-vue-next'

const historyStore = useHistoryStore()
const router = useRouter()
const showDeleteConfirmation = ref(false)
const itemToDelete = ref(null)
const fileInput = ref(null)

// Computed para obtener el historial ordenado
const historyItems = computed(() => historyStore.historyItems)

// Computed para estadísticas
const stats = computed(() => historyStore.getHistoryStats())

// Navigate back to camera
const goBack = () => {
  router.push('/')
}

// Export history
const exportHistory = () => {
  historyStore.exportHistory()
}

// Import history
const importHistory = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  historyStore.importHistory(file)
    .then((count) => {
      alert(`${count} elementos importados exitosamente`)
    })
    .catch((error) => {
      alert(`Error al importar: ${error.message}`)
    })
    .finally(() => {
      // Clear file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    })
}

// Trigger file input
const triggerImport = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Formatear fecha
const formatDate = (date) => {
  // Asegurar que tenemos un objeto Date válido
  const dateObj = date instanceof Date ? date : new Date(date)
  
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

// Obtener color según la confianza
const getConfidenceColor = (result) => {
  if (result.error) return 'text-red-600'
  
  const confidence = result.fullConfidence || 0
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 50) return 'text-yellow-600'
  return 'text-orange-600'
}

// Obtener clase de fondo según la confianza
const getConfidenceBackground = (result) => {
  if (result.error) return 'bg-red-50 border-red-200'
  
  const confidence = result.fullConfidence || 0
  if (confidence >= 80) return 'bg-green-50 border-green-200'
  if (confidence >= 50) return 'bg-yellow-50 border-yellow-200'
  return 'bg-orange-50 border-orange-200'
}

// Confirmar eliminación
const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteConfirmation.value = true
}

// Eliminar elemento
const deleteItem = () => {
  if (itemToDelete.value) {
    historyStore.removeFromHistory(itemToDelete.value.id)
    itemToDelete.value = null
    showDeleteConfirmation.value = false
  }
}

// Cancelar eliminación
const cancelDelete = () => {
  itemToDelete.value = null
  showDeleteConfirmation.value = false
}

// Limpiar todo el historial
const clearAllHistory = () => {
  if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
    historyStore.clearHistory()
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Back Button and Header -->
      <div class="mb-8">
        <button 
          @click="goBack"
          class="mb-4 flex items-center gap-2 text-text hover:text-text-deep transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>Volver a la cámara</span>
        </button>
        
        <h1 class="text-3xl font-bold text-text mb-2">Historial de Reconocimientos</h1>
        <p class="text-text-deep mb-2">
          Aquí puedes ver todos los análisis de hongos que has realizado
        </p>
        <p class="text-sm text-text-deep opacity-75 mb-4">
          💾 Los datos se guardan automáticamente en tu dispositivo
        </p>

        <!-- Statistics Card -->
        <div v-if="historyItems.length > 0" class="mt-4 bg-sand bg-opacity-20 rounded-lg p-4 border border-hover">
          <h3 class="font-semibold text-text mb-2">Estadísticas del Historial</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div class="font-bold text-text text-lg">{{ stats.total }}</div>
              <div class="text-text-deep">Total</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-green-600 text-lg">{{ stats.successful }}</div>
              <div class="text-text-deep">Exitosos</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-red-600 text-lg">{{ stats.errors }}</div>
              <div class="text-text-deep">Errores</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-text text-lg">{{ stats.successRate }}%</div>
              <div class="text-text-deep">Éxito</div>
            </div>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-if="historyItems.length > 0"
            @click="clearAllHistory"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 class="w-4 h-4" />
            Limpiar Historial
          </button>

          <button
            v-if="historyItems.length > 0"
            @click="exportHistory"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Download class="w-4 h-4" />
            Exportar
          </button>

          <button
            @click="triggerImport"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Upload class="w-4 h-4" />
            Importar
          </button>

          <!-- Hidden file input for import -->
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            @change="importHistory"
            class="hidden"
          />
        </div>
      </div>

      <!-- Lista del historial -->
      <div v-if="historyItems.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-4 bg-sand rounded-full flex items-center justify-center">
          <BarChart3 class="w-12 h-12 text-background" />
        </div>
        <h2 class="text-xl font-medium text-text mb-2">No hay análisis realizados</h2>
        <p class="text-text-deep mb-6">
          Comienza analizando hongos en la sección de reconocimiento
        </p>
        <RouterLink
          to="/"
          class="bg-sand text-background px-6 py-3 rounded-lg hover:bg-hover transition-colors inline-flex items-center gap-2"
        >
          Ir a Reconocimiento
        </RouterLink>
      </div>

      <!-- Grid de elementos del historial -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in historyItems"
          :key="item.id"
          class="border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          :class="getConfidenceBackground(item.result)"
        >
          <!-- Imagen -->
          <div class="relative">
            <img
              :src="item.image"
              :alt="item.result.name"
              class="w-full h-48 object-cover"
            />
            <!-- Botón eliminar -->
            <button
              @click="confirmDelete(item)"
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <!-- Indicador de error -->
            <div v-if="item.result.error" class="absolute top-2 left-2 bg-red-500 text-white rounded-full p-2">
              <AlertTriangle class="w-4 h-4" />
            </div>
          </div>

          <!-- Información -->
          <div class="p-4">
            <!-- Fecha -->
            <div class="flex items-center gap-2 text-sm text-text-deep mb-3">
              <Calendar class="w-4 h-4" />
              {{ formatDate(item.timestamp) }}
            </div>

            <!-- Resultado -->
            <div class="space-y-2">
              <h3 class="font-bold text-lg text-text">{{ item.result.name }}</h3>
              
              <div 
                class="text-sm font-medium"
                :class="getConfidenceColor(item.result)"
              >
                {{ item.result.error ? item.result.confidence : `Confianza: ${item.result.confidence}` }}
              </div>

              <!-- Nombres comunes -->
              <div v-if="item.result.commonNames && item.result.commonNames.length > 0" class="text-sm text-text-deep">
                <strong>Nombres comunes:</strong>
                <div class="mt-1">{{ item.result.commonNames.join(', ') }}</div>
              </div>

              <!-- Descripción -->
              <div v-if="item.result.description && !item.result.error" class="text-sm text-text-deep">
                <strong>Descripción:</strong>
                <div class="mt-1 text-justify line-clamp-3">{{ item.result.description }}</div>
              </div>

              <!-- Taxonomía básica -->
              <div v-if="item.result.taxonomy && Object.keys(item.result.taxonomy).length > 0 && !item.result.error" 
                   class="text-xs text-text-deep">
                <strong>Clasificación:</strong>
                <div class="mt-1 space-y-0.5">
                  <div v-if="item.result.taxonomy.family">Familia: {{ item.result.taxonomy.family }}</div>
                  <div v-if="item.result.taxonomy.genus">Género: {{ item.result.taxonomy.genus }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-background rounded-lg p-6 max-w-sm w-full border border-border shadow-xl">
        <h3 class="text-lg font-bold text-text mb-3">Confirmar eliminación</h3>
        <p class="text-text-deep mb-6">
          ¿Estás seguro de que quieres eliminar este análisis del historial?
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteItem"
            class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
          <button
            @click="cancelDelete"
            class="flex-1 bg-hover text-background py-2 px-4 rounded-lg hover:bg-text-deep transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Clase para truncar texto en múltiples líneas */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>